<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class SubscriptionTypeType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\SubscriptionTypeType::STANDARD => 'Standard',
            \Application\DBAL\Types\SubscriptionTypeType::PRO => 'Pro',
            \Application\DBAL\Types\SubscriptionTypeType::SOLIDARITY => 'Solidarité',
        ];

        parent::__construct($config);
    }
}
