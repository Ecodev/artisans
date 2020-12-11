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
        $config = [
            'email' => [
                'admins' => [
                    'john.doe@example.com',
                    'jane.doe@@example.com',
                ],
            ],
        ];

        $messageQueuer = new MessageQueuer(
            $entityManager,
            $messageRenderer,
            $config,
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
        $message = $messageQueuer->queueConfirmedRegistration($admin->getEmail(), $registeredUser);

        $this->assertMessage($message, null, 'administrator@example.com', MessageTypeType::CONFIRMED_REGISTRATION, 'Nouvel utilisateur');
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

        $message = $messageQueuer->queueUpdatedUser($admin->getEmail(), $updatedUser, $before, $after);

        $this->assertMessage($message, null, 'administrator@example.com', MessageTypeType::UPDATED_USER, 'Un utilisateur a modifié ses données personnelles');
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

        $message = $messageQueuer->queueAdminPendingOrder($admin->getEmail(), $order);

        $this->assertMessage($message, null, 'administrator@example.com', MessageTypeType::ADMIN_PENDING_ORDER, 'Une commande a besoin d\'un BVR');
    }

    public function testQueueAdminPendingOrderWithoutSubscription(): void
    {
        $admin = $this->createMockUserAdmin();
        $user = $this->createMockUser();
        $order = $this->createMockOrder($user, false);
        $messageQueuer = $this->createMockMessageQueuer();

        $message = $messageQueuer->queueAdminPendingOrder($admin->getEmail(), $order);

        $this->assertMessage($message, null, 'administrator@example.com', MessageTypeType::ADMIN_PENDING_ORDER, 'Une commande a besoin d\'un BVR', 'without-subscription');
    }

    public function testQueueAdminValidatedOrder(): void
    {
        $admin = $this->createMockUserAdmin();
        $user = $this->createMockUser();
        $order = $this->createMockOrder($user);
        $messageQueuer = $this->createMockMessageQueuer();

        $message = $messageQueuer->queueAdminValidatedOrder($admin->getEmail(), $order);

        $this->assertMessage($message, null, 'administrator@example.com', MessageTypeType::ADMIN_VALIDATED_ORDER, 'Commande à comptabiliser');
    }

    public function testQueueAdminValidatedOrderWithoutOwner(): void
    {
        $admin = $this->createMockUserAdmin();
        $order = $this->createMockOrder(null);
        $messageQueuer = $this->createMockMessageQueuer();

        $message = $messageQueuer->queueAdminValidatedOrder($admin->getEmail(), $order);

        $this->assertMessage($message, null, 'administrator@example.com', MessageTypeType::ADMIN_VALIDATED_ORDER, 'Commande à comptabiliser', 'without-owner');
    }

    public function testQueueRequestMembershipEnd(): void
    {
        $admin = $this->createMockUserAdmin();
        $user = $this->createMockUser();
        $messageQueuer = $this->createMockMessageQueuer();

        $message = $messageQueuer->queueRequestMembershipEnd($admin->getEmail(), $user);

        $this->assertMessage($message, null, 'administrator@example.com', MessageTypeType::REQUEST_MEMBERSHIP_END, 'Demande d\'arrêt de cotisations');
    }

    public function testQueueNewsletterSubscription(): void
    {
        $admin = $this->createMockUserAdmin();
        $messageQueuer = $this->createMockMessageQueuer();

        $message = $messageQueuer->queueNewsletterSubscription($admin->getEmail(), 'john.doe@example.com');

        $this->assertMessage($message, null, 'administrator@example.com', MessageTypeType::NEWSLETTER_SUBSCRIPTION, 'Demande d\'inscription à la newsletter');
    }

    public function testGetEmailsToNotify(): void
    {
        $messageQueuer = $this->createMockMessageQueuer();

        $emails = $messageQueuer->getAllEmailsToNotify();

        self::assertCount(2, $emails);
        self::assertContains('john.doe@example.com', $emails);
    }

    private function createMockOrder(?User $owner, bool $withSubscription = true): Order
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

        if ($withSubscription) {
            $lines = new ArrayCollection([$productLine, $subscriptionLine, $subscriptionLine2, $donationLine]);
        } else {
            $lines = new ArrayCollection([$productLine, $donationLine]);
        }

        $order = $this->createPartialMock(Order::class, ['getId', 'getBalanceCHF', 'getBalanceEUR', 'getOrderLines']);
        $order->setOwner($owner);
        $order->setPaymentMethod(PaymentMethodType::BVR);

        $order->expects(self::any())
            ->method('getId')
            ->willReturn(456);

        $order->expects(self::any())
            ->method('getBalanceCHF')
            ->willReturn(Money::CHF(3300));

        $order->expects(self::any())
            ->method('getBalanceEUR')
            ->willReturn(Money::EUR(0));

        $order->expects(self::any())
            ->method('getOrderLines')
            ->willReturn($lines);

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
