<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class PurchaseStatusType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\PurchaseStatusType::OK => 'OK',
            \Application\DBAL\Types\PurchaseStatusType::TO_ORDER => 'À commander',
            \Application\DBAL\Types\PurchaseStatusType::PREORDERED => 'Précommandé',
            \Application\DBAL\Types\PurchaseStatusType::ORDERED => 'Commandé',
        ];

        parent::__construct($config);
    }
}
