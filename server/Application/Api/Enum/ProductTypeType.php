<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class ProductTypeType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\ProductTypeType::PAPER => 'Papier',
            \Application\DBAL\Types\ProductTypeType::DIGITAL => 'Numérique',
            \Application\DBAL\Types\ProductTypeType::BOTH => 'Papier et numérique',
        ];

        parent::__construct($config);
    }
}
