<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Ecodev\Felix\Api\Enum\EnumType;

class MembershipType extends EnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\MembershipType::NONE => 'Non membre',
            \Application\DBAL\Types\MembershipType::MEMBER => 'Membre',
        ];

        parent::__construct($config);
    }
}
