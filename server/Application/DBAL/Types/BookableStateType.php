<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class BookableStateType extends AbstractEnumType
{
    const GOOD = 'good';
    const USED = 'used';
    const DEGRADED = 'degraded';

    protected function getPossibleValues(): array
    {
        return [
            self::GOOD,
            self::USED,
            self::DEGRADED,
        ];
    }
}
