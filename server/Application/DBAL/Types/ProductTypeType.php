<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Ecodev\Felix\DBAL\Types\EnumType;

class ProductTypeType extends EnumType
{
    public const OTHER = 'other';
    public const PAPER = 'paper';
    public const DIGITAL = 'digital';
    public const BOTH = 'both';

    protected function getPossibleValues(): array
    {
        return [
            self::OTHER,
            self::PAPER,
            self::DIGITAL,
            self::BOTH,
        ];
    }

    public static function getDigitalTypes(): array
    {
        return [self::BOTH, self::DIGITAL];
    }

    public static function includesDigital(?string $type): bool
    {
        return in_array($type, self::getDigitalTypes(), true);
    }
}
