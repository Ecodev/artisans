<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class BookingStatusType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\BookingStatusType::APPLICATION => 'Demande en attente',
            \Application\DBAL\Types\BookingStatusType::PROCESSED => 'Demande traitée',
            \Application\DBAL\Types\BookingStatusType::BOOKED => 'Réservé',
        ];

        parent::__construct($config);
    }
}
