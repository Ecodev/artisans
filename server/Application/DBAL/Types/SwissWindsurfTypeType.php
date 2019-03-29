<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class SwissWindsurfTypeType extends AbstractEnumType
{
    const ACTIVE = 'active';
    const PASSIVE = 'passive';

    protected function getPossibleValues(): array
    {
        return [
            self::ACTIVE,
            self::PASSIVE,
        ];
    }
}
