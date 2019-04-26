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
            ['2.154', '2.16'],
            ['199.99', '199.99'],
            ['2.95', '2.95'],
            ['0', '0.00'],
            ['0.502', '0.51'],
            ['0.3075', '0.31'],
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
