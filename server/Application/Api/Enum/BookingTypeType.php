<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class BookingTypeType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\BookingTypeType::SELF_APPROVED => 'Carnet de sortie',
            \Application\DBAL\Types\BookingTypeType::ADMIN_APPROVED => 'Stockage et services pour demande',
            \Application\DBAL\Types\BookingTypeType::ADMIN_ONLY => 'Stockage et services effectifs',
            \Application\DBAL\Types\BookingTypeType::MANDATORY => 'Services obligatoires',
        ];

        parent::__construct($config);
    }
}
