<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class BookingStatusType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\BookingStatusType::APPLICATION => 'Demande',
            \Application\DBAL\Types\BookingStatusType::BOOKED => 'Réservé',
            \Application\DBAL\Types\BookingStatusType::PROCESSED => 'Traité (en cas de rejet)',
        ];

        parent::__construct($config);
    }
}
