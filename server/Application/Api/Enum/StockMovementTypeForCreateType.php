<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class StockMovementTypeForCreateType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\StockMovementTypeType::SPECIAL_SALE => 'Vente spéciale',
            \Application\DBAL\Types\StockMovementTypeType::LOSS => 'Perte',
            \Application\DBAL\Types\StockMovementTypeType::DELIVERY => 'Livraison',
            \Application\DBAL\Types\StockMovementTypeType::INVENTORY => 'Inventaire',
        ];

        parent::__construct($config);
    }
}
