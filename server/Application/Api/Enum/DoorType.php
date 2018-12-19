<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class DoorType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            'door1' => 'Entrée nord',
            'door2' => 'Entrée plage',
            'door3' => 'Vestibule',
            'door4' => 'Local technique',
        ];

        parent::__construct($config);
    }
}
