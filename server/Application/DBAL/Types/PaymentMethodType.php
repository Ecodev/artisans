<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Ecodev\Felix\DBAL\Types\EnumType;

class PaymentMethodType extends EnumType
{
    public const DATATRANS = 'datatrans';
    public const EBANKING = 'ebanking';
    public const BVR = 'bvr';

    protected function getPossibleValues(): array
    {
        return [
            self::DATATRANS,
            self::EBANKING,
            self::BVR,
        ];
    }
}
