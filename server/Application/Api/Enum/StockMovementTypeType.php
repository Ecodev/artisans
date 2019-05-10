<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class StockMovementTypeType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\StockMovementTypeType::SELL => 'Vente',
            \Application\DBAL\Types\StockMovementTypeType::LOSS => 'Perte',
            \Application\DBAL\Types\StockMovementTypeType::DELIVERY => 'Livraison',
            \Application\DBAL\Types\StockMovementTypeType::INVENTORY => 'Inventaire',
        ];

        parent::__construct($config);
    }
}
