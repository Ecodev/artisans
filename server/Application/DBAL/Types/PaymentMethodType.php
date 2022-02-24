<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Ecodev\Felix\DBAL\Types\EnumType;

class PaymentMethodType extends EnumType
{
    final public const DATATRANS = 'datatrans';
    final public const EBANKING = 'ebanking';
    final public const BVR = 'bvr';

    protected function getPossibleValues(): array
    {
        return [
            self::DATATRANS,
            self::EBANKING,
            self::BVR,
        ];
    }
}
