<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Order;
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

    public function providerGetFormattedBalance(): array
    {
        return [
            [0, 0, '0.00 CHF'],
            [150, 0, '1.50 CHF'],
            [0, 275, '2.75 EUR'],
            [150, 275, '2.75 EUR'], // should not happen
        ];
    }
}
