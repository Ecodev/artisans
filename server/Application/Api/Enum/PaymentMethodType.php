<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class PaymentMethodType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\PaymentMethodType::DATATRANS => 'Carte de crédit',
            \Application\DBAL\Types\PaymentMethodType::EBANKING => 'Virement bancaire',
            \Application\DBAL\Types\PaymentMethodType::BVR => 'Bulletin de versement',
        ];

        parent::__construct($config);
    }
}
