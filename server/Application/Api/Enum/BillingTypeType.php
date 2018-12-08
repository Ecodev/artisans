<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class BillingTypeType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\BillingTypeType::ALL_ELECTRONIC => 'En ligne avec rappel par e-mail',
            \Application\DBAL\Types\BillingTypeType::PAPER_BILL_ELECTRONIC_REMINDER => 'BVR avec rappel par e-mail',
            \Application\DBAL\Types\BillingTypeType::PAPER_BILL_PAPER_REMINDER => 'BVR avec rappel par e-mail et papier',
        ];

        parent::__construct($config);
    }
}
