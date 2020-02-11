<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\DBAL\Types\MessageTypeType;
use Application\Model\Message;
use Application\Model\User;
use Application\Service\MessageQueuer;
use Doctrine\ORM\EntityManager;
use Laminas\View\Renderer\RendererInterface;
use Prophecy\Argument;

class MessageQueuerTest extends \PHPUnit\Framework\TestCase
{
    private function createMockMessageQueuer(): MessageQueuer
    {
        global $container;

        $entityManager = $container->get(EntityManager::class);
        $renderer = $container->get(RendererInterface::class);

        $messageQueuer = new MessageQueuer(
            $entityManager,
            $renderer,
            'artisans.lan'
        );

        return $messageQueuer;
    }

    public function testQueueRegister(): void
    {
        $user = $this->createMockUserMinimal();
        $messageQueuer = $this->createMockMessageQueuer();
        $message = $messageQueuer->queueRegister($user);

        $this->assertMessage($message, $user, 'minimal@example.com', MessageTypeType::REGISTER, 'Demande de création de compte Les artisans de la transition');
    }

    public function testQueueUnregister(): void
    {
        $unregisteredUser = $this->createMockUser();
        $admin = $this->createMockUserAdmin();
        $messageQueuer = $this->createMockMessageQueuer();
        $message = $messageQueuer->queueUnregister($admin, $unregisteredUser);

        $this->assertMessage($message, $admin, 'administrator@example.com', MessageTypeType::UNREGISTER, 'Démission');
    }

    public function testQueueResetPassword(): void
    {
        $user = $this->createMockUser();
        $messageQueuer = $this->createMockMessageQueuer();
        $message = $messageQueuer->queueResetPassword($user, 'householder@example.com');

        $this->assertMessage($message, $user, 'householder@example.com', MessageTypeType::RESET_PASSWORD, 'Demande de modification de mot de passe');
    }

    private function createMockUser(): User
    {
        $prophecy = $this->prophesize(User::class);
        $prophecy->getId()->willReturn(123);
        $prophecy->getFirstName()->willReturn('John');
        $prophecy->getLastName()->willReturn('Doe');
        $prophecy->getName()->willReturn('John Doe');
        $prophecy->getEmail()->willReturn('john.doe@example.com');
        $prophecy->createToken()->willReturn(str_repeat('X', 32));
        $prophecy->messageAdded(Argument::type(Message::class));

        $user = $prophecy->reveal();

        return $user;
    }

    private function createMockUserAdmin(): User
    {
        $prophecy = $this->prophesize(User::class);
        $prophecy->getFirstName()->willReturn('Admin');
        $prophecy->getLastName()->willReturn('Istrator');
        $prophecy->getEmail()->willReturn('administrator@example.com');
        $prophecy->messageAdded(Argument::type(Message::class));

        $user = $prophecy->reveal();

        return $user;
    }

    private function createMockUserMinimal(): User
    {
        $prophecy = $this->prophesize(User::class);
        $prophecy->getFirstName();
        $prophecy->getLastName();
        $prophecy->getEmail()->willReturn('minimal@example.com');
        $prophecy->createToken()->willReturn(str_repeat('X', 32));
        $prophecy->messageAdded(Argument::type(Message::class));
        $user = $prophecy->reveal();

        return $user;
    }

    private function assertMessage(Message $message, ?User $user, string $email, string $type, string $subject, ?string $variant = null): void
    {
        self::assertSame($type, $message->getType());
        self::assertSame($email, $message->getEmail());
        self::assertSame($user, $message->getRecipient());
        self::assertNull($message->getDateSent());
        self::assertSame($subject, $message->getSubject());

        $variant = $variant ? '-' . $variant : $variant;
        $expectedBody = 'tests/data/emails/' . str_replace('_', '-', $type . $variant) . '.html';
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
