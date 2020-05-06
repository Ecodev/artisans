<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class MembershipType extends AbstractEnumType
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
