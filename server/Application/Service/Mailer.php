<?php

declare(strict_types=1);

namespace Application\Service;

use Application\Model\Message;
use Cake\Chronos\Chronos;
use Doctrine\ORM\EntityManager;
use Zend\Mail;
use Zend\Mail\Transport\TransportInterface;
use Zend\Mime\Message as MimeMessage;
use Zend\Mime\Mime;
use Zend\Mime\Part as MimePart;

/**
 * Service to send a message as an email
 */
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
     * @var null|string
     */
    private $emailOverride;

    /**
     * @var string
     */
    private $fromEmail;

    /**
     * @var string
     */
    private $phpPath;

    public function __construct(EntityManager $entityManager, TransportInterface $transport, ?string $emailOverride, string $fromEmail, string $phpPath)
    {
        $this->entityManager = $entityManager;
        $this->transport = $transport;
        $this->emailOverride = $emailOverride;
        $this->fromEmail = $fromEmail;
        $this->phpPath = $phpPath;
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
            $this->entityManager->flush();
        }

        $args = [
            realpath('bin/send-message.php'),
            $message->getId(),
        ];

        $escapedArgs = array_map('escapeshellarg', $args);

        $cmd = escapeshellcmd($this->phpPath) . ' ' . implode(' ', $escapedArgs) . ' > /dev/null 2>&1 &';
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
     * @param Message $modelMessage
     *
     * @return Mail\Message
     */
    private function modelMessageToMailMessage(Message $modelMessage): Mail\Message
    {
        // set Mime type html
        $htmlPart = new MimePart($modelMessage->getBody());
        $htmlPart->type = Mime::TYPE_HTML;
        $body = new MimeMessage();
        $body->setParts([$htmlPart]);

        $mailMessage = new Mail\Message();
        $mailMessage->setSubject($modelMessage->getSubject());
        $mailMessage->setBody($body);
        $mailMessage->setFrom($this->fromEmail, 'Ichtus');

        return $mailMessage;
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
