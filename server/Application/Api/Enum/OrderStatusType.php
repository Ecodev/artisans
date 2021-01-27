<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Application\Model\Order;
use Ecodev\Felix\Api\Enum\EnumType;

class OrderStatusType extends EnumType
{
    public function __construct()
    {
        $config = [
            Order::STATUS_PENDING => 'Paiement en attente',
            Order::STATUS_VALIDATED => 'Validée',
            Order::STATUS_CANCELED => 'Annulée',
        ];

        parent::__construct($config);
    }
}
