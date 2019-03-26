<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class ExpenseClaimTypeType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\ExpenseClaimTypeType::EXPENSE_CLAIM => 'Dépense',
            \Application\DBAL\Types\ExpenseClaimTypeType::REFUND => 'Remboursement',
        ];
        parent::__construct($config);
    }
}
