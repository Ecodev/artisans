<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class ProductTypeType extends AbstractEnumType
{
    const PAPER = 'paper';
    const DIGITAL = 'digital';
    const BOTH = 'both';

    protected function getPossibleValues(): array
    {
        return [
            self::PAPER,
            self::DIGITAL,
            self::BOTH,
        ];
    }
}
