<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class BookableStateType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\BookableStateType::GOOD => 'Bon',
            \Application\DBAL\Types\BookableStateType::USED => 'Usagé',
            \Application\DBAL\Types\BookableStateType::DEGRADED => 'Dégradé',
        ];
        parent::__construct($config);
    }
}
