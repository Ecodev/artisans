<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class StockMovementTypeType extends AbstractEnumType
{
    const LOSS = 'loss';
    const DELIVERY = 'delivery';
    const INVENTORY = 'inventory';
    const SALE = 'sale';
    const SPECIAL_SALE = 'special_sale';

    protected function getPossibleValues(): array
    {
        return [
            self::SPECIAL_SALE,
            self::SALE,
            self::LOSS,
            self::DELIVERY,
            self::INVENTORY,
        ];
    }
}
