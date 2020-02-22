<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class PaymentMethodType extends AbstractEnumType
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
