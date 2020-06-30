<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\DBAL\Types\MessageTypeType;
use Application\DBAL\Types\PaymentMethodType;
use Application\DBAL\Types\ProductTypeType;
use Application\Model\Country;
use Application\Model\Message;
use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\Product;
use Application\Model\Subscription;
use Application\Model\User;
use Application\Service\MessageQueuer;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManager;
use Ecodev\Felix\Service\MessageRenderer;
use Laminas\View\Renderer\RendererInterface;
use Money\Money;

class MessageQueuerTest extends \PHPUnit\Framework\TestCase
{
    private function createMockMessageQueuer(): MessageQueuer
    {
        global $container;

        $entityManager = $container->get(EntityManager::class);
        $viewRenderer = $container->get(RendererInterface::class);
        $messageRenderer = new MessageRenderer($viewRenderer, 'artisans.lan');

        $messageQueuer = new MessageQueuer(
            $entityManager,
            $messageRenderer,
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
        $message = $messageQueuer->queueResetPassword($user, 'john@example.com');

        $this->assertMessage($message, $user, 'john@example.com', MessageTypeType::RESET_PASSWORD, 'Demande de modification de mot de passe');
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

        $message = $messageQueuer->queueUserPendingOrder($order->getOwner(), $order);

        $this->assertMessage($message, $user, 'john.doe@example.com', MessageTypeType::USER_PENDING_ORDER, 'Votre commande est en cours de traitement');
    }

    public function testQueueUserValidatedOrder(): void
    {
        $user = $this->createMockUser();
        $order = $this->createMockOrder($user);
        $messageQueuer = $this->createMockMessageQueuer();

        $message = $messageQueuer->queueUserValidatedOrder($order->getOwner(), $order);

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

    public function testQueueAdminValidatedOrderWithoutOwner(): void
    {
        $admin = $this->createMockUserAdmin();
        $order = $this->createMockOrder(null);
        $messageQueuer = $this->createMockMessageQueuer();

        $message = $messageQueuer->queueAdminValidatedOrder($admin, $order);

        $this->assertMessage($message, $admin, 'administrator@example.com', MessageTypeType::ADMIN_VALIDATED_ORDER, 'Commande à comptabiliser', 'without-owner');
    }

    public function testQueueRequestMembershipEnd(): void
    {
        $admin = $this->createMockUserAdmin();
        $user = $this->createMockUser();
        $messageQueuer = $this->createMockMessageQueuer();

        $message = $messageQueuer->queueRequestMembershipEnd($admin, $user);

        $this->assertMessage($message, $admin, 'administrator@example.com', MessageTypeType::REQUEST_MEMBERSHIP_END, 'Demande d\'arrêt de cotisations');
    }

    public function testQueueNewsletterSubscription(): void
    {
        $admin = $this->createMockUserAdmin();
        $messageQueuer = $this->createMockMessageQueuer();

        $message = $messageQueuer->queueNewsletterSubscription($admin, 'john.doe@example.com');

        $this->assertMessage($message, $admin, 'administrator@example.com', MessageTypeType::NEWSLETTER_SUBSCRIPTION, 'Demande d\'inscription à la newsletter');
    }

    private function createMockOrder(?User $owner): Order
    {
        $product = $this->createMock(Product::class);
        $product->expects(self::any())
            ->method('getId')
            ->willReturn(1);

        $product->expects(self::any())
            ->method('getCode')
            ->willReturn('xxx-yyy');

        $product->expects(self::any())
            ->method('getName')
            ->willReturn('Article 1');

        $productLine = new OrderLine();
        $productLine->setProduct($product);
        $productLine->setBalanceCHF(Money::CHF(500));
        $productLine->setBalanceEUR(Money::EUR(0));
        $productLine->setType(ProductTypeType::PAPER);

        $subscriptionLine = new OrderLine();
        $subscriptionLine->setSubscription(new Subscription());
        $subscriptionLine->setName('Abonnement standard papier');
        $subscriptionLine->setBalanceCHF(Money::CHF(1500));
        $subscriptionLine->setBalanceEUR(Money::EUR(0));
        $subscriptionLine->setType(ProductTypeType::BOTH);

        $subscriptionLine2 = new OrderLine();
        $subscriptionLine2->setSubscription(new Subscription());
        $subscriptionLine2->setName('Abonnement institutionnel numérique');
        $subscriptionLine2->setAdditionalEmails(['alice@example.com', 'bob@example.com', 'carol@example.com']);
        $subscriptionLine2->setBalanceCHF(Money::CHF(2500));
        $subscriptionLine2->setBalanceEUR(Money::EUR(0));
        $subscriptionLine2->setType(ProductTypeType::DIGITAL);

        $donationLine = new OrderLine();
        $donationLine->setName('Don');
        $donationLine->setBalanceCHF(Money::CHF(3500));
        $donationLine->setBalanceEUR(Money::EUR(0));
        $donationLine->setType(ProductTypeType::OTHER);

        $lines = new ArrayCollection([$productLine, $subscriptionLine, $subscriptionLine2, $donationLine]);

        $order = $this->createMock(Order::class);
        $order->expects(self::any())
            ->method('getId')
            ->willReturn(456);

        $order->expects(self::any())
            ->method('getBalanceCHF')
            ->willReturn(Money::CHF(1500));

        $order->expects(self::any())
            ->method('getBalanceEUR')
            ->willReturn(Money::EUR(0));

        $order->expects(self::any())
            ->method('getOrderLines')
            ->willReturn($lines);

        $order->expects(self::any())
            ->method('getOwner')
            ->willReturn($owner);

        $order->expects(self::any())
            ->method('getFormattedBalance')
            ->willReturn('33.00 CHF');

        $order->expects(self::any())
            ->method('getPaymentMethod')
            ->willReturn(PaymentMethodType::BVR);

        return $order;
    }

    private function createMockUser(): User
    {
        $user = $this->createMock(User::class);

        $user->expects(self::any())
            ->method('getId')
            ->willReturn(123);

        $user->expects(self::any())
            ->method('getFirstName')
            ->willReturn('John');

        $user->expects(self::any())
            ->method('getLastName')
            ->willReturn('Doe');

        $user->expects(self::any())
            ->method('getName')
            ->willReturn('John Doe');

        $user->expects(self::any())
            ->method('getStreet')
            ->willReturn('Main street');

        $user->expects(self::any())
            ->method('getPostcode')
            ->willReturn('2020');

        $user->expects(self::any())
            ->method('getLocality')
            ->willReturn('Locality');

        $user->expects(self::any())
            ->method('getCountry')
            ->willReturn(new Country('Wookaya'));

        $user->expects(self::any())
            ->method('getPhone')
            ->willReturn('123 456 87 98');

        $user->expects(self::any())
            ->method('getEmail')
            ->willReturn('john.doe@example.com');

        $user->expects(self::any())
            ->method('createToken')
            ->willReturn(str_repeat('X', 32));

        return $user;
    }

    private function createMockUserAdmin(): User
    {
        $user = $this->createMock(User::class);

        $user->expects(self::any())
            ->method('getFirstName')
            ->willReturn('Admin');

        $user->expects(self::any())
            ->method('getLastName')
            ->willReturn('Istrator');

        $user->expects(self::any())
            ->method('getEmail')
            ->willReturn('administrator@example.com');

        return $user;
    }

    private function createMockUserMinimal(): User
    {
        $user = $this->createMock(User::class);
        $user->expects(self::any())
            ->method('getEmail')
            ->willReturn('minimal@example.com');

        $user->expects(self::any())
            ->method('createToken')
            ->willReturn(str_repeat('X', 32));

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
