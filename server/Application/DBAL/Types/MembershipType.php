<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Ecodev\Felix\DBAL\Types\EnumType;

class MembershipType extends EnumType
{
    const NONE = 'none';
    const DUE = 'due';
    const PAYED = 'payed';

    protected function getPossibleValues(): array
    {
        return [
            self::NONE,
            self::DUE,
            self::PAYED,
        ];
    }
}
