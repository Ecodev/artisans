<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Enum\ProductType;
use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\Subscription;
use Application\Model\User;
use PHPUnit\Framework\TestCase;

class OrderLineTest extends TestCase
{
    public function testOrderRelation(): void
    {
        $order1 = new Order();
        self::assertCount(0, $order1->getOrderLines());

        $orderLine1 = new OrderLine();
        $orderLine2 = new OrderLine();
        $orderLine1->setOrder($order1);
        $orderLine2->setOrder($order1);

        self::assertCount(2, $order1->getOrderLines());

        $order2 = new Order();
        $orderLine2->setOrder($order2);

        self::assertCount(1, $order1->getOrderLines());
        self::assertCount(1, $order2->getOrderLines());
    }

    public function testMaybeGiveTemporaryAccess(): void
    {
        $creator = new User();
        User::setCurrent($creator);

        $orderLine = new OrderLine();
        $orderLine->timestampCreation();

        $orderLine->maybeGiveTemporaryAccess();
        self::assertFalse($creator->getWebTemporaryAccess(), 'no access because not a subscription');

        $subscription = new Subscription();
        $subscription->setType(ProductType::Paper);
        $orderLine->setSubscription($subscription);
        $orderLine->maybeGiveTemporaryAccess();
        self::assertFalse($creator->getWebTemporaryAccess(), 'no access because paper subscription');

        $subscription->setType(ProductType::Both);
        $orderLine->maybeGiveTemporaryAccess();
        self::assertTrue($creator->getWebTemporaryAccess(), 'access because subscription includes digital');

        /** @var User $beneficiary */
        $beneficiary = _em()->getReference(User::class, 1000);
        self::assertFalse($beneficiary->getWebTemporaryAccess(), 'originally no access');

        $orderLine->setAdditionalEmails(['administrator@example.com']);
        $orderLine->maybeGiveTemporaryAccess();
        self::assertTrue($beneficiary->getWebTemporaryAccess(), 'automatically given access via his email');
    }
}
