<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class MessageTypeType extends AbstractEnumType
{
    const REGISTER = 'register';
    const UNREGISTER = 'unregister';
    const RESET_PASSWORD = 'reset_password';
    const UPDATED_USER = 'updated_user';
    const CONFIRMED_REGISTRATION = 'confirmed_registration';
    const USER_PENDING_ORDER = 'user_pending_order';
    const USER_VALIDATED_ORDER = 'user_validated_order';
    const ADMIN_PENDING_ORDER = 'admin_pending_order';
    const ADMIN_VALIDATED_ORDER = 'admin_validated_order';
    const REQUEST_MEMBERSHIP_END = 'request_membership_end';
    const NEWSLETTER_SUBSCRIPTION = 'newsletter_subscription';

    protected function getPossibleValues(): array
    {
        return [
            self::REGISTER,
            self::UNREGISTER,
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
