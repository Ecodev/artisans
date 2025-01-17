<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Enum\OrderStatus;
use Application\Model\Order;
use Application\Model\OrderLine;
use Money\Money;
use PHPUnit\Framework\TestCase;

class OrderTest extends TestCase
{
    /**
     * @dataProvider providerGetFormattedBalance
     */
    public function testGetFormattedBalance(int $chf, int $eur, string $expected): void
    {
        $order = $this->getMockBuilder(Order::class)->onlyMethods(['getBalanceCHF', 'getBalanceEUR'])->getMock();

        $order->expects(self::any())
            ->method('getBalanceCHF')
            ->willReturn(Money::CHF($chf));

        $order->expects(self::any())
            ->method('getBalanceEUR')
            ->willReturn(Money::EUR($eur));

        self::assertSame($expected, $order->getFormattedBalance());
    }

    public function providerGetFormattedBalance(): iterable
    {
        yield [0, 0, '0.00 CHF'];
        yield [150, 0, '1.50 CHF'];
        yield [0, 275, '2.75 EUR'];
        yield [150, 275, '2.75 EUR'];
    }

    public function testSetStatusWillGiveAccess(): void
    {
        $orderLine = $this->getMockBuilder(OrderLine::class)
            ->onlyMethods(['maybeGiveTemporaryAccess'])
            ->getMock();

        $orderLine->expects(self::once())
            ->method('maybeGiveTemporaryAccess');

        $order = new Order();
        $orderLine->setOrder($order);

        $order->setStatus(OrderStatus::Validated);
    }

    public function testSetStatusWillNotGiveAccessIfGoingBackToPending(): void
    {
        $orderLine = $this->getMockBuilder(OrderLine::class)
            ->onlyMethods(['maybeGiveTemporaryAccess'])
            ->getMock();

        $orderLine->expects(self::never())
            ->method('maybeGiveTemporaryAccess');

        $order = new Order();
        $order->setStatus(OrderStatus::Validated);
        $orderLine->setOrder($order);

        $order->setStatus(OrderStatus::Pending);
    }

    public function testSetStatusWillNotGiveAccessIfStayingValidated(): void
    {
        $orderLine = $this->getMockBuilder(OrderLine::class)
            ->onlyMethods(['maybeGiveTemporaryAccess'])
            ->getMock();

        $orderLine->expects(self::never())
            ->method('maybeGiveTemporaryAccess');

        $order = new Order();
        $order->setStatus(OrderStatus::Validated);
        $orderLine->setOrder($order);

        $order->setStatus(OrderStatus::Validated);
    }
}
