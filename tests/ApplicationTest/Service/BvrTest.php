<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\Service\Bvr;
use PHPUnit\Framework\TestCase;

class BvrTest extends TestCase
{
    /**
     * @dataProvider providerGetReferenceNumber
     */
    public function testGetReferenceNumber(string $bankAccount, string $referenceNumber, string $expected): void
    {
        $actual = Bvr::getReferenceNumber($bankAccount, $referenceNumber);
        self::assertSame($expected, $actual);
    }

    public function providerGetReferenceNumber()
    {
        return [
            ['123456', '', '123456000000000000000000006'],
            ['123456', '789', '123456000000000000000007891'],
        ];
    }

    /**
     * @dataProvider providerConcatReferenceNumber
     */
    public function testConcatReferenceNumber(string $bankAccount, string $referenceNumber, string $expected): void
    {
        $actual = Bvr::concatReferenceNumber($bankAccount, $referenceNumber);
        self::assertSame($expected, $actual);
    }

    public function providerConcatReferenceNumber()
    {
        return [
            ['123456', '', '12345600000000000000000000'],
            ['123456', '789', '12345600000000000000000789'],
        ];
    }

    public function testGetEncodingLineMustThrowIfTooLongBankAccount(): void
    {
        $this->expectExceptionMessage('Invalid bank number. It must be exactly 6 digits.');
        Bvr::concatReferenceNumber('1234567', '123');
    }

    public function testGetEncodingLineMustThrowIfTooLongReferenceNumber(): void
    {
        $this->expectExceptionMessage('Invalid reference number. It must be 20 or less digits.');
        Bvr::concatReferenceNumber('123456', str_repeat('0', 21));
    }

    public function testGetEncodingLineMustThrowIfInvalidReferenceNumber(): void
    {
        $this->expectExceptionMessage('Invalid reference number. It must be 20 or less digits.');
        Bvr::concatReferenceNumber('123456', '1.5');
    }

    /**
     * @dataProvider providerModulo10
     */
    public function testModulo10(string $number, int $expected): void
    {
        $actual = Bvr::modulo10($number);
        self::assertSame($expected, $actual);
    }

    public function providerModulo10()
    {
        return [
            ['', 0],
            ['0', 0],
            ['04', 2],
            ['313947143000901', 8],
            ['80082600000000000000000201', 6],
        ];
    }

    /**
     * @dataProvider providerGetEncodingLine
     */
    public function testGetEncodingLine(string $referenceNumber, string $postalAccount, ?string $amount, string $expected): void
    {
        $actual = Bvr::getEncodingLine($referenceNumber, $postalAccount, $amount);
        self::assertSame($expected, $actual);
    }

    public function providerGetEncodingLine()
    {
        return [
            ['80082600000000000000000201', '01-4567-0', null, '042>800826000000000000000002016+ 010045670>'],
            ['', '1-2-3', null, '042>000000000000000000000000000+ 010000023>'],
            ['123', '01-4567-0', '1.45', '0100000001453>000000000000000000000001236+ 010045670>'],
        ];
    }

    public function testGetEncodingLineMustThrowIfTooLongReference(): void
    {
        $this->expectExceptionMessage('Invalid reference number');
        Bvr::getEncodingLine(str_repeat('0', 27), '01-4567-0');
    }

    public function testGetEncodingLineMustThrowIfInvalidReference(): void
    {
        $this->expectExceptionMessage('Invalid reference number');
        Bvr::getEncodingLine('0.0', '01-4567-0');
    }

    public function testGetEncodingLineMustThrowIfInvalidPostAccount(): void
    {
        $this->expectExceptionMessage('Invalid post account number');
        Bvr::getEncodingLine('0', '0145670');
    }

    public function testGetEncodingLineMustThrowIfTooLongPostAccount(): void
    {
        $this->expectExceptionMessage('The post account number is too long');
        Bvr::getEncodingLine('0', '0123-456789-0');
    }
}
