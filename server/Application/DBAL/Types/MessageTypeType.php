<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class MessageTypeType extends AbstractEnumType
{
    const MONTLY_REMINDER = 'monthly_reminder';
    const YEARLY_REMINDER = 'yearly_reminder';

    protected function getPossibleValues(): array
    {
        return [
            self::MONTLY_REMINDER,
            self::YEARLY_REMINDER,
        ];
    }
}
