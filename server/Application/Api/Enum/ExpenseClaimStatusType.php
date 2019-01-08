<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class ExpenseClaimStatusType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\ExpenseClaimStatusType::NEW => 'nouveau',
            \Application\DBAL\Types\ExpenseClaimStatusType::PROCESSED => 'traîté',
            \Application\DBAL\Types\ExpenseClaimStatusType::REJECTED => 'refusé',
        ];

        parent::__construct($config);
    }
}
