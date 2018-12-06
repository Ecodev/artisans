<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class BookingStatusType extends AbstractEnumType
{
    const APPLICATION = 'application';
    const BOOKED = 'booked';
    const PROCESSED = 'processed';

    protected function getPossibleValues(): array
    {
        return [
            self::APPLICATION,
            self::BOOKED,
            self::PROCESSED,
        ];
    }
}
