<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class OrderTypeType extends AbstractEnumType
{
    const PAPER = 'paper';
    const DIGITAL = 'digital';

    protected function getPossibleValues(): array
    {
        return [
            self::PAPER,
            self::DIGITAL,
        ];
    }
}
