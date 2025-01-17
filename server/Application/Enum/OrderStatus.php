<?php

declare(strict_types=1);

namespace Application\Enum;

use Ecodev\Felix\Api\Enum\LocalizedPhpEnumType;

enum OrderStatus: string implements LocalizedPhpEnumType
{
    case Pending = 'pending';
    case Validated = 'validated';
    case Canceled = 'canceled';

    public function getDescription(): string
    {
        return match ($this) {
            self::Pending => 'Paiement en attente',
            self::Validated => 'Validée',
            self::Canceled => 'Annulée',
        };
    }
}
