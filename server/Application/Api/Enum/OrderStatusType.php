<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Application\Model\Order;

class OrderStatusType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            Order::STATUS_PENDING => 'Paiement en attente',
            Order::STATUS_VALIDATED => 'Validée',
        ];

        parent::__construct($config);
    }
}
