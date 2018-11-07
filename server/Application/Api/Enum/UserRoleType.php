<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Application\Model\User;

class UserRoleType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            User::ROLE_MEMBER => 'Member',
            User::ROLE_ADMINISTRATOR => 'An administrator',
        ];

        parent::__construct($config);
    }
}
