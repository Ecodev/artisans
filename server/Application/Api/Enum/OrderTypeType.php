<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class OrderTypeType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\OrderTypeType::PAPER => 'Papier',
            \Application\DBAL\Types\OrderTypeType::DIGITAL => 'Numérique',
        ];

        parent::__construct($config);
    }
}
