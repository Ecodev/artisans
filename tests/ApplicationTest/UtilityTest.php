<?php

declare(strict_types=1);

namespace ApplicationTest;

use Application\Model\User;
use Application\Utility;

class UtilityTest extends \PHPUnit\Framework\TestCase
{
    public function testNow(): void
    {
        self::assertStringStartsWith('201', Utility::getNow()->format('c'));
    }

    public function testGetShortClassName(): void
    {
        self::assertSame('User', Utility::getShortClassName(new User()));
    }

    public function moneyRoundUpDataProvider()
    {
        return [
            ['2.55', '2.55'],
            ['2.154', '2.20'],
            ['199.99', '200.00'],
            ['2.95', '2.95'],
            ['0', '0.00'],
            ['0.3075', '0.35'],
        ];
    }

    /**
     * @dataProvider moneyRoundUpDataProvider
     */
    public function testMoneyRoundUp(string $number, string $expected): void
    {
        $this->assertSame($expected, Utility::moneyRoundUp($number));
    }
}
