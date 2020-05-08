<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Ecodev\Felix\Api\Enum\EnumType;

class ProductTypeType extends EnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\ProductTypeType::OTHER => 'Autre',
            \Application\DBAL\Types\ProductTypeType::PAPER => 'Papier',
            \Application\DBAL\Types\ProductTypeType::DIGITAL => 'Numérique',
            \Application\DBAL\Types\ProductTypeType::BOTH => 'Papier et numérique',
        ];

        parent::__construct($config);
    }
}
