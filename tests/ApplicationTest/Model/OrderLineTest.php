<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Order;
use Application\Model\OrderLine;
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
}
