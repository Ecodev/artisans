<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Model\User;

class UserRoleType extends AbstractEnumType
{
    protected function getPossibleValues(): array
    {
        return [
            User::ROLE_MEMBER,
            User::ROLE_ADMINISTRATOR,
        ];
    }
}
