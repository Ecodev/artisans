<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Ecodev\Felix\DBAL\Types\EnumType;

class MessageTypeType extends EnumType
{
    final public const REGISTER = 'register';
    final public const RESET_PASSWORD = 'reset_password';
    final public const UPDATED_USER = 'updated_user';
    final public const CONFIRMED_REGISTRATION = 'confirmed_registration';
    final public const USER_PENDING_ORDER = 'user_pending_order';
    final public const USER_VALIDATED_ORDER = 'user_validated_order';
    final public const ADMIN_PENDING_ORDER = 'admin_pending_order';
    final public const ADMIN_VALIDATED_ORDER = 'admin_validated_order';
    final public const REQUEST_MEMBERSHIP_END = 'request_membership_end';
    final public const NEWSLETTER_SUBSCRIPTION = 'newsletter_subscription';

    protected function getPossibleValues(): array
    {
        return [
            self::REGISTER,
            self::RESET_PASSWORD,
            self::UPDATED_USER,
            self::CONFIRMED_REGISTRATION,
            self::USER_PENDING_ORDER,
            self::USER_VALIDATED_ORDER,
            self::ADMIN_PENDING_ORDER,
            self::ADMIN_VALIDATED_ORDER,
            self::REQUEST_MEMBERSHIP_END,
            self::NEWSLETTER_SUBSCRIPTION,
        ];
    }
}
