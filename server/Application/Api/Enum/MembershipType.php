<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class MembershipType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\MembershipType::NONE => 'Non membre',
            \Application\DBAL\Types\MembershipType::DUE => 'Membre (côtisation dûe)',
            \Application\DBAL\Types\MembershipType::PAYED => 'Membre (côtisation payée)',
        ];

        parent::__construct($config);
    }
}
