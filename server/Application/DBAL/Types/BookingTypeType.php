<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class BookingTypeType extends AbstractEnumType
{
    const SELF_APPROVED = 'self_approved';
    const ADMIN_APPROVED = 'admin_approved';
    const ADMIN_ONLY = 'admin_only';
    const MANDATORY = 'mandatory';

    protected function getPossibleValues(): array
    {
        return [
            self::SELF_APPROVED,
            self::ADMIN_APPROVED,
            self::ADMIN_ONLY,
            self::MANDATORY,
        ];
    }
}
