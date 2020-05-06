<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class MembershipType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\MembershipType::NONE => 'Non',
            \Application\DBAL\Types\MembershipType::DUE => 'Doit être payé',
            \Application\DBAL\Types\MembershipType::PAYED => 'Payé',
        ];

        parent::__construct($config);
    }
}
