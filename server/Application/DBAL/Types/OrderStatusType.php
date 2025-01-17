<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Enum\OrderStatus;
use Ecodev\Felix\DBAL\Types\PhpEnumType;

class OrderStatusType extends PhpEnumType
{
    protected function getEnumType(): string
    {
        return OrderStatus::class;
    }
}
