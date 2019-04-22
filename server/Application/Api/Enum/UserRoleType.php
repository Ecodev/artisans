<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Application\Model\User;

class UserRoleType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            User::ROLE_PARTNER => 'Uniquement pour voir users (spécial)',
            User::ROLE_INDIVIDUAL => 'Individu',
            User::ROLE_MEMBER => 'Membre',
            User::ROLE_RESPONSIBLE => 'Responsable de secteur',
            User::ROLE_ADMINISTRATOR => 'Administrateur',
        ];

        parent::__construct($config);
    }
}
