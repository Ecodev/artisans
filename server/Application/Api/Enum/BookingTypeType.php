<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class BookingTypeType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\BookingTypeType::SELF_APPROVED => 'Carnet de sortie',
            \Application\DBAL\Types\BookingTypeType::ADMIN_APPROVED => 'Pour ouverture de compte',
            \Application\DBAL\Types\BookingTypeType::ADMIN_ONLY => 'Inventaire et services optionnels',
            \Application\DBAL\Types\BookingTypeType::MANDATORY => 'Services obligatoires',
        ];

        parent::__construct($config);
    }
}
