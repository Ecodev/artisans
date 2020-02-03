<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Model\Order;

class OrderStatusType extends AbstractEnumType
{
    protected function getPossibleValues(): array
    {
        return [
            Order::STATUS_PENDING,
            Order::STATUS_VALIDATED,
        ];
    }
}
