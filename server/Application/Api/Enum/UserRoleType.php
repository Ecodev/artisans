<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Application\Model\User;
use Ecodev\Felix\Api\Enum\EnumType;

class UserRoleType extends EnumType
{
    public function __construct()
    {
        $config = [
            User::ROLE_MEMBER => 'Membre',
            User::ROLE_FACILITATOR => 'Facilitateur',
            User::ROLE_ADMINISTRATOR => 'Administrateur',
        ];

        parent::__construct($config);
    }
}
