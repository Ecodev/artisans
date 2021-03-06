<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Ecodev\Felix\DBAL\Types\EnumType;

class PaymentMethodType extends EnumType
{
    const DATATRANS = 'datatrans';
    const EBANKING = 'ebanking';
    const BVR = 'bvr';

    protected function getPossibleValues(): array
    {
        return [
            self::DATATRANS,
            self::EBANKING,
            self::BVR,
        ];
    }
}
