<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class SwissSailingTypeType extends AbstractEnumType
{
    const ACTIVE = 'active';
    const PASSIVE = 'passive';
    const JUNIOR = 'junior';

    protected function getPossibleValues(): array
    {
        return [
            self::ACTIVE,
            self::PASSIVE,
            self::JUNIOR,
        ];
    }
}
