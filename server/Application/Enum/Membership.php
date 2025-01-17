<?php

declare(strict_types=1);

namespace Application\Enum;

use Ecodev\Felix\Api\Enum\LocalizedPhpEnumType;

enum Membership: string implements LocalizedPhpEnumType
{
    case None = 'none';
    case Member = 'member';

    public function getDescription(): string
    {
        return match ($this) {
            self::None => 'Non membre',
            self::Member => 'Membre',
        };
    }
}
