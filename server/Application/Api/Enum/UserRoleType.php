<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Application\Model\User;

class UserRoleType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            User::ROLE_BOOKING_ONLY => 'Uniquement cahier de sortie (spécial)',
            User::ROLE_INDIVIDUAL => 'Individu',
            User::ROLE_MEMBER => 'Membre',
            User::ROLE_RESPONSIBLE => 'Responsable de secteur',
            User::ROLE_ADMINISTRATOR => 'Administrateur',
        ];

        parent::__construct($config);
    }
}
