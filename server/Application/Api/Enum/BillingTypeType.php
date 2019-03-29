<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class BillingTypeType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\BillingTypeType::ELECTRONIC => 'Par e-mail',
            \Application\DBAL\Types\BillingTypeType::PAPER => 'Par courrier postal',
        ];

        parent::__construct($config);
    }
}
