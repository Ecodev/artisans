<?php

declare(strict_types=1);

namespace Application\Enum;

use Ecodev\Felix\Api\Enum\LocalizedPhpEnumType;

enum PaymentMethod: string implements LocalizedPhpEnumType
{
    case Datatrans = 'datatrans';
    case Ebanking = 'ebanking';
    case Bvr = 'bvr';

    public function getDescription(): string
    {
        return match ($this) {
            self::Datatrans => 'Carte de crédit',
            self::Ebanking => 'Virement bancaire',
            self::Bvr => 'Bulletin de versement',
        };
    }
}
