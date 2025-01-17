<?php

declare(strict_types=1);

namespace Application\Enum;

use Ecodev\Felix\Api\Enum\LocalizedPhpEnumType;

enum ProductType: string implements LocalizedPhpEnumType
{
    case Other = 'other';
    case Paper = 'paper';
    case Digital = 'digital';
    case Both = 'both';

    public function getDescription(): string
    {
        return match ($this) {
            self::Other => 'Autre',
            self::Paper => 'Papier',
            self::Digital => 'Numérique',
            self::Both => 'Papier et numérique',
        };
    }

    public static function getDigitalTypes(): array
    {
        return [self::Both, self::Digital];
    }

    public static function includesDigital(?self $type): bool
    {
        return in_array($type, self::getDigitalTypes(), true);
    }
}
