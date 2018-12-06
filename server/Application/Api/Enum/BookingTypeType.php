<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class BookingTypeType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\BookingTypeType::SELF_APPROVED => 'Normal',
            \Application\DBAL\Types\BookingTypeType::ADMIN_APPROVED => 'Pour ouverture de compte',
            \Application\DBAL\Types\BookingTypeType::ADMIN_ONLY => 'Casiers et accessoires',
            \Application\DBAL\Types\BookingTypeType::MANDATORY => 'Service',
        ];

        parent::__construct($config);
    }
}
