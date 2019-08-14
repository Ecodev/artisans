<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class PurchaseStatusType extends AbstractEnumType
{
    const OK = 'ok';
    const TO_ORDER = 'to_order';
    const PREORDERED = 'preordered';
    const ORDERED = 'ordered';

    protected function getPossibleValues(): array
    {
        return [
            self::OK,
            self::TO_ORDER,
            self::PREORDERED,
            self::ORDERED,
        ];
    }
}
