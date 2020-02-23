<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\DBAL\Types\MessageTypeType;
use Application\DBAL\Types\PaymentMethodType;
use Application\Model\Country;
use Application\Model\Message;
use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\Product;
use Application\Model\User;
use Application\Service\MessageQueuer;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManager;
use Laminas\View\Renderer\RendererInterface;
use Money\Money;
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

    public function testQueueConfirmedRegistration(): void
    {
        $registeredUser = $this->createMockUser();
        $admin = $this->createMockUserAdmin();
        $messageQueuer = $this->createMockMessageQueuer();
        $message = $messageQueuer->queueConfirmedRegistration($admin, $registeredUser);

        $this->assertMessage($message, $admin, 'administrator@example.com', MessageTypeType::CONFIRMED_REGISTRATION, 'Nouveau membre');
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

    public function testQueueUpdatedUser(): void
    {
        $updatedUser = $this->createMockUser();
        $admin = $this->createMockUserAdmin();
        $messageQueuer = $this->createMockMessageQueuer();

        $before = [
            'Prénom' => 'John',
            'Nom de famille ' => 'Doe',
        ];

        $after = [
            'Prénom' => 'John',
            'Nom de famille ' => 'Connor',
        ];

        $message = $messageQueuer->queueUpdatedUser($admin, $updatedUser, $before, $after);

        $this->assertMessage($message, $admin, 'administrator@example.com', MessageTypeType::UPDATED_USER, 'Un utilisateur a modifié ses données personnelles');
    }

    public function testQueueUserPendingOrder(): void
    {
        $user = $this->createMockUser();
        $order = $this->createMockOrder($user);
        $messageQueuer = $this->createMockMessageQueuer();

        $message = $messageQueuer->queueUserPendingOrder($order);

        $this->assertMessage($message, $user, 'john.doe@example.com', MessageTypeType::USER_PENDING_ORDER, 'Votre commande est en cours de traitement');
    }

    public function testQueueUserValidatedOrder(): void
    {
        $user = $this->createMockUser();
        $order = $this->createMockOrder($user);
        $messageQueuer = $this->createMockMessageQueuer();

        $message = $messageQueuer->queueUserValidatedOrder($order);

        $this->assertMessage($message, $user, 'john.doe@example.com', MessageTypeType::USER_VALIDATED_ORDER, 'Votre commande a été validée');
    }

    public function testQueueAdminPendingOrder(): void
    {
        $admin = $this->createMockUserAdmin();
        $user = $this->createMockUser();
        $order = $this->createMockOrder($user);
        $messageQueuer = $this->createMockMessageQueuer();

        $message = $messageQueuer->queueAdminPendingOrder($admin, $order);

        $this->assertMessage($message, $admin, 'administrator@example.com', MessageTypeType::ADMIN_PENDING_ORDER, 'Une commande a besoin d\'un BVR');
    }

    public function testQueueAdminValidatedOrder(): void
    {
        $admin = $this->createMockUserAdmin();
        $user = $this->createMockUser();
        $order = $this->createMockOrder($user);
        $messageQueuer = $this->createMockMessageQueuer();

        $message = $messageQueuer->queueAdminValidatedOrder($admin, $order);

        $this->assertMessage($message, $admin, 'administrator@example.com', MessageTypeType::ADMIN_VALIDATED_ORDER, 'Commande à comptabiliser');
    }

    private function createMockUser(): User
    {
        $prophecy = $this->prophesize(User::class);
        $prophecy->getId()->willReturn(123);
        $prophecy->getFirstName()->willReturn('John');
        $prophecy->getLastName()->willReturn('Doe');
        $prophecy->getName()->willReturn('John Doe');
        $prophecy->getStreet()->willReturn('Main street');
        $prophecy->getPostcode()->willReturn('2020');
        $prophecy->getLocality()->willReturn('Locality');
        $prophecy->getCountry()->willReturn(new Country('Wookaya'));
        $prophecy->getPhone()->willReturn('123 456 87 98');
        $prophecy->getEmail()->willReturn('john.doe@example.com');
        $prophecy->createToken()->willReturn(str_repeat('X', 32));
        $prophecy->messageAdded(Argument::type(Message::class));

        $user = $prophecy->reveal();

        return $user;
    }

    private function createMockOrder(User $owner): Order
    {
        $prophecyProduct = $this->prophesize(Product::class);
        $prophecyProduct->getId()->willReturn(1);
        $prophecyProduct->getName()->willReturn('Article 1');

        $productLine = new OrderLine();
        $productLine->setProduct($prophecyProduct->reveal());

        $subscriptionLine = new OrderLine();
        $subscriptionLine->setName('Abonnement standard papier');

        $donationLine = new OrderLine();
        $donationLine->setName('Donation');

        $lines = new ArrayCollection([$productLine, $subscriptionLine, $donationLine]);

        $prophecy = $this->prophesize(Order::class);
        $prophecy->getId()->willReturn(456);
        $prophecy->getBalanceCHF()->willReturn(Money::CHF(1500));
        $prophecy->getBalanceEUR()->willReturn(Money::EUR(0));
        $prophecy->getOrderLines()->willReturn($lines);
        $prophecy->getOwner()->willReturn($owner);
        $prophecy->getFormattedBalance()->willReturn('33.00 CHF');
        $prophecy->getPaymentMethod()->willReturn(PaymentMethodType::BVR);

        $order = $prophecy->reveal();

        return $order;
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
