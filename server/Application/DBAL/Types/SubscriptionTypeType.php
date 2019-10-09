<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class SubscriptionTypeType extends AbstractEnumType
{
    const STANDARD = 'standard';
    const PRO = 'pro';
    const SOLIDARITY = 'solidarity';

    protected function getPossibleValues(): array
    {
        return [
            self::STANDARD,
            self::PRO,
            self::SOLIDARITY,
        ];
    }
}
