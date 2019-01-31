<?php

declare(strict_types=1);

namespace Application\Service;

use Application\DBAL\Types\MessageTypeType;
use Application\Model\Message;
use Application\Model\User;
use Cake\Chronos\Chronos;
use Doctrine\ORM\EntityManager;
use Zend\Mail;
use Zend\Mail\Transport\TransportInterface;
use Zend\Mime\Message as MimeMessage;
use Zend\Mime\Part as MimePart;
use Zend\View\Model\ViewModel;
use Zend\View\Renderer\RendererInterface;

class Mailer
{
    /**
     * @var EntityManager
     */
    private $entityManager;

    /**
     * @var TransportInterface
     */
    private $transport;

    /**
     * @var string
     */
    private $hostname;

    /**
     * @var null|string
     */
    private $emailOverride;

    /**
     * @var RendererInterface
     */
    private $viewRendered;

    public function __construct(EntityManager $entityManager, TransportInterface $transport, RendererInterface $viewRenderer, string $hostname, ?string $emailOverride)
    {
        $this->entityManager = $entityManager;
        $this->transport = $transport;
        $this->hostname = $hostname;
        $this->emailOverride = $emailOverride;
        $this->viewRendered = $viewRenderer;
    }

    public function queueRegister(User $user): Message
    {
        $subject = 'Demande de création de compte Ichtus';
        $mailParams = [
            'token' => $user->createToken(),
        ];

        $message = $this->createMessage($user, $user->getEmail(), $subject, MessageTypeType::REGISTER, new ViewModel($mailParams));

        return $message;
    }

    /**
     * Queue a reset password email to specified user
     *
     * @param User $user The user for which a password reset will be done
     * @param string $email the addresse to send the email to. Might be different than the user's email
     *
     * @return Message
     */
    public function queueResetPassword(User $user, string $email): Message
    {
        $user->createToken();

        $subject = 'Demande de modification de mot de passe';
        $mailParams = [
            'token' => $user->createToken(),
        ];

        $message = $this->createMessage($user, $email, $subject, MessageTypeType::RESET_PASSWORD, new ViewModel($mailParams));

        return $message;
    }

    /**
     * Create a message by rendering the template
     *
     * @param null|User $user
     * @param string $email
     * @param string $subject
     * @param string $type
     * @param ViewModel $model
     *
     * @return Message
     */
    private function createMessage(?User $user, string $email, string $subject, string $type, ViewModel $model): Message
    {
        // First render the view
        $serverUrl = 'https://' . $this->hostname;
        $model->setTemplate(str_replace('_', '-', $type));
        $model->setVariable('email', $email);
        $model->setVariable('user', $user);
        $model->setVariable('serverUrl', $serverUrl);
        $partialContent = $this->viewRendered->render($model);

        // Then inject it into layout
        $layoutModel = new ViewModel([$model->captureTo() => $partialContent]);
        $layoutModel->setTemplate('layout');
        $layoutModel->setVariable('subject', $subject);
        $layoutModel->setVariable('user', $user);
        $layoutModel->setVariable('serverUrl', $serverUrl);
        $layoutModel->setVariable('hostname', $this->hostname);
        $content = $this->viewRendered->render($layoutModel);

        $message = new Message();
        $message->setType($type);
        $message->setRecipient($user);
        $message->setSubject($subject);
        $message->setBody($content);
        $message->setEmail($email);
        $this->entityManager->persist($message);

        return $message;
    }

    /**
     * Send a message asynchronously in a separate process.
     *
     * This should be the preferred way to send a message, unless if we are the cron.
     *
     * @param Message $message
     */
    public function sendMessageAsync(Message $message): void
    {
        // Be sure we have an ID before "forking" process
        if ($message->getId() === null) {
            _em()->flush();
        }

        $dispatcher = realpath('bin/send-message.php');
        $cmd = $dispatcher . ' ' . $message->getId() . ' > /dev/null 2>&1 &';
        exec($cmd);
    }

    /**
     * Send a message
     *
     * @param Message $message
     */
    public function sendMessage(Message $message): void
    {
        $mailMessage = $this->modelMessageToMailMessage($message);

        $email = $message->getEmail();
        $overriddenBy = '';
        if ($this->emailOverride) {
            $email = $this->emailOverride;
            $overriddenBy = ' overridden by ' . $email;
        }

        $recipientName = $message->getRecipient() ? $message->getRecipient()->getName() : null;
        if ($email) {
            $mailMessage->addTo($email, $recipientName);
            $this->transport->send($mailMessage);
        }

        $message->setDateSent(new Chronos());
        $this->entityManager->flush();

        echo 'email sent to: ' . $message->getEmail() . "\t" . $overriddenBy . "\t" . $message->getSubject() . PHP_EOL;
    }

    /**
     * Convert our model message to a mail message
     *
     * @param Message $message
     *
     * @return Mail\Message
     */
    private function modelMessageToMailMessage(Message $message): Mail\Message
    {
        // set Mime type html
        $htmlPart = new MimePart($message->getBody());
        $htmlPart->type = 'text/html';
        $body = new MimeMessage();
        $body->setParts([$htmlPart]);

        $message = new Mail\Message();
        $message->setSubject($message->getSubject());
        $message->setBody($body);
        $message->setFrom('noreply@' . $this->hostname, 'Ichtus');

        return $message;
    }

    /**
     * Send all messages that are not sent yet
     */
    public function sendAllMessages(): void
    {
        $messages = $this->entityManager->getRepository(Message::class)->getAllMessageToSend();
        foreach ($messages as $message) {
            $this->sendMessage($message);
        }
    }
}
