<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\DBAL\Types\MessageTypeType;
use Application\Model\Message;
use Application\Model\User;
use Application\Service\Mailer;
use Doctrine\ORM\EntityManager;
use Prophecy\Argument;
use Zend\Mail\Transport\InMemory;
use Zend\View\Renderer\RendererInterface;

class MailerTest extends \PHPUnit\Framework\TestCase
{
    private function createMockMailer(): Mailer
    {
        global $container;

        $entityManager = $this->createMock(EntityManager::class);
        $renderer = $container->get(RendererInterface::class);
        $transport = new InMemory();
        $config = $container->get('config');

        $mailer = new Mailer($entityManager, $transport, $renderer, $config['hostname'], $config['emailOverride'] ?? null);

        return $mailer;
    }

    public function testQueueRegister(): void
    {
        $user = $this->createMockUser(true);
        $mailer = $this->createMockMailer();
        $message = $mailer->queueRegister($user);

        $this->assertMessage($message, $user, 'john.doe@example.com', MessageTypeType::REGISTER, 'Demande de création de compte Ichtus');
    }

    public function testQueueResetPassword(): void
    {
        $user = $this->createMockUser();
        $mailer = $this->createMockMailer();
        $message = $mailer->queueResetPassword($user, 'householder@example.com');

        $this->assertMessage($message, $user, 'householder@example.com', MessageTypeType::RESET_PASSWORD, 'Demande de modification de mot de passe');
    }

    public function testSendMessage(): void
    {
        $mailer = $this->createMockMailer();
        $message = new Message();
        $message->setEmail('john.doe@example.com');

        $this->expectOutputRegex('~email sent to: john\.doe@example\.com~');
        $mailer->sendMessage($message);
        self::assertNotNull($message->getDateSent());
    }

    private function createMockUser(bool $minimal = false): User
    {
        $prophecy = $this->prophesize(User::class);
        if ($minimal) {
            $prophecy->getLogin();
            $prophecy->getFirstName();
            $prophecy->getLastName();
        } else {
            $prophecy->getLogin()->willReturn('john.doe');
            $prophecy->getFirstName()->willReturn('John');
            $prophecy->getLastName()->willReturn('Doe');
        }

        $prophecy->getEmail()->willReturn('john.doe@example.com');
        $prophecy->createToken()->willReturn(str_repeat('X', 32));
        $prophecy->messageAdded(Argument::type(Message::class));
        $user = $prophecy->reveal();

        return $user;
    }

    private function assertMessage(Message $message, ?User $user, string $email, string $type, string $subject): void
    {
        self::assertSame($type, $message->getType());
        self::assertSame($email, $message->getEmail());
        self::assertSame($user, $message->getRecipient());
        self::assertNull($message->getDateSent());
        self::assertSame($subject, $message->getSubject());

        $expectedBody = 'tests/data/emails/' . str_replace('_', '-', $type) . '.html';
        $this->assertFile($expectedBody, $message->getBody());
    }

    /**
     * Custom assert that will not produce gigantic diff
     *
     * @param string $file
     * @param string $actual
     */
    private function assertFile(string $file, string $actual): void
    {
        // Log actual result for easier comparison with external diff tools
        $logFile = 'logs/' . $file;
        $dir = dirname($logFile);
        @mkdir($dir, 0777, true);
        file_put_contents($logFile, $actual);

        self::assertFileExists($file, 'Expected file must exist on disk, fix it with: cp ' . $logFile . ' ' . $file);
        $expected = file_get_contents($file);

        self::assertTrue($expected === $actual, 'File content does not match, compare with: meld ' . $file . ' ' . $logFile);
    }
}
