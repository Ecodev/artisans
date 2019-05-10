<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class StockMovementTypeType extends AbstractEnumType
{
    const SELL = 'sale';
    const LOSS = 'loss';
    const DELIVERY = 'delivery';
    const INVENTORY = 'inventory';

    protected function getPossibleValues(): array
    {
        return [
            self::SELL,
            self::LOSS,
            self::DELIVERY,
            self::INVENTORY,
        ];
    }
}
