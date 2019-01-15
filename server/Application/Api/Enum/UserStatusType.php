<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Application\Model\User;

class UserStatusType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            User::STATUS_INACTIVE => 'Inactif',
            User::STATUS_ACTIVE => 'Actif',
            User::STATUS_NEW => 'Nouveau',
            User::STATUS_ARCHIVED => 'Archivé',
        ];

        parent::__construct($config);
    }
}
