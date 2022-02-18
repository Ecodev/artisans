<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Ecodev\Felix\DBAL\Types\EnumType;

class MembershipType extends EnumType
{
    final public const NONE = 'none';
    final public const MEMBER = 'member';

    protected function getPossibleValues(): array
    {
        return [
            self::NONE,
            self::MEMBER,
        ];
    }
}
