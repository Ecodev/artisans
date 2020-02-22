<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class MessageTypeType extends AbstractEnumType
{
    const REGISTER = 'register';
    const UNREGISTER = 'unregister';
    const RESET_PASSWORD = 'reset_password';
    const UPDATED_USER = 'updated_user';

    protected function getPossibleValues(): array
    {
        return [
            self::REGISTER,
            self::UNREGISTER,
            self::RESET_PASSWORD,
            self::UPDATED_USER,
        ];
    }
}
