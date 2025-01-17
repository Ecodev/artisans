<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Enum\PaymentMethod;
use Ecodev\Felix\DBAL\Types\PhpEnumType;

class PaymentMethodType extends PhpEnumType
{
    protected function getEnumType(): string
    {
        return PaymentMethod::class;
    }
}
