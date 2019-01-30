<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class MessageTypeType extends AbstractEnumType
{
    const RESET_PASSWORD = 'reset_password';
    const MONTHLY_REMINDER = 'monthly_reminder';
    const YEARLY_REMINDER = 'yearly_reminder';

    protected function getPossibleValues(): array
    {
        return [
            self::RESET_PASSWORD,
            self::MONTHLY_REMINDER,
            self::YEARLY_REMINDER,
        ];
    }
}
