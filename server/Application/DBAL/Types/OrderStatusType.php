<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Model\Order;
use Ecodev\Felix\DBAL\Types\EnumType;

class OrderStatusType extends EnumType
{
    protected function getPossibleValues(): array
    {
        return [
            Order::STATUS_PENDING,
            Order::STATUS_VALIDATED,
            Order::STATUS_CANCELED,
        ];
    }
}
