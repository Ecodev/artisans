<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Enum\Membership;
use Ecodev\Felix\DBAL\Types\PhpEnumType;

class MembershipType extends PhpEnumType
{
    protected function getEnumType(): string
    {
        return Membership::class;
    }
}
