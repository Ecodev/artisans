<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class BillingTypeType extends AbstractEnumType
{
    const ELECTRONIC = 'electronic';
    const PAPER = 'paper';

    protected function getPossibleValues(): array
    {
        return [
            self::ELECTRONIC,
            self::PAPER,
        ];
    }
}
