<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class StockMovementTypeType extends AbstractEnumType
{
    const SALE = 'sale';
    const LOSS = 'loss';
    const DELIVERY = 'delivery';
    const INVENTORY = 'inventory';

    protected function getPossibleValues(): array
    {
        return [
            self::SALE,
            self::LOSS,
            self::DELIVERY,
            self::INVENTORY,
        ];
    }
}
