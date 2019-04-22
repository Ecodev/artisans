<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Model\User;

class UserRoleType extends AbstractEnumType
{
    protected function getPossibleValues(): array
    {
        return [
            User::ROLE_PARTNER,
            User::ROLE_INDIVIDUAL,
            User::ROLE_MEMBER,
            User::ROLE_RESPONSIBLE,
            User::ROLE_ADMINISTRATOR,
        ];
    }
}
