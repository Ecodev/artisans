<?php

declare(strict_types=1);

namespace Application\Service;

use Application\Model\Message;
use Application\Repository\LogRepository;
use Cake\Chronos\Chronos;
use Doctrine\ORM\EntityManager;
use Exception;
use Laminas\Mail;
use Laminas\Mail\Transport\TransportInterface;
use Laminas\Mime\Message as MimeMessage;
use Laminas\Mime\Mime;
use Laminas\Mime\Part as MimePart;

/**
 * Service to send a message as an email
 */
class Mailer
{
    /**
     * @var resource
     */
    private $lock;

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
        $htmlPart->charset = 'UTF-8';
        $htmlPart->encoding = Mime::ENCODING_BASE64;

        $body = new MimeMessage();
        $body->setParts([$htmlPart]);

        $mailMessage = new Mail\Message();
        $mailMessage->setEncoding('UTF-8');
        $mailMessage->setSubject($modelMessage->getSubject());
        $mailMessage->setBody($body);
        $mailMessage->setFrom($this->fromEmail, 'Artisans');

        return $mailMessage;
    }

    /**
     * Send all messages that are not sent yet
     */
    public function sendAllMessages(): void
    {
        $this->acquireLock();
        $messages = $this->entityManager->getRepository(Message::class)->getAllMessageToSend();
        foreach ($messages as $message) {
            $this->sendMessage($message);
        }
    }

    /**
     * Acquire an exclusive lock
     *
     * This is to ensure only one mailer can run at any given time. This is to prevent sending the same email twice.
     */
    private function acquireLock(): void
    {
        $lockFile = 'data/tmp/mailer.lock';
        touch($lockFile);
        $this->lock = fopen($lockFile, 'r+');
        if ($this->lock === false) {
            throw new Exception('Could not read lock file. This is not normal and might be a permission issue');
        }

        if (!flock($this->lock, LOCK_EX | LOCK_NB)) {
            $message = LogRepository::MAILER_LOCKED;
            _log()->info($message);

            echo $message . PHP_EOL;
            echo 'If the problem persist and another mailing is not in progress, try deleting ' . $lockFile . PHP_EOL;

            // Not getting the lock is not considered as error to avoid being spammed
            die();
        }
    }
}
