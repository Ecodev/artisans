<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class MessageTypeType extends AbstractEnumType
{
    const MONTHLY_REMINDER = 'monthly_reminder';
    const YEARLY_REMINDER = 'yearly_reminder';

    protected function getPossibleValues(): array
    {
        return [
            self::MONTHLY_REMINDER,
            self::YEARLY_REMINDER,
        ];
    }
}
