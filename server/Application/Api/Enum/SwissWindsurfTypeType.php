<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class SwissWindsurfTypeType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\SwissWindsurfTypeType::ACTIVE => 'Actif',
            \Application\DBAL\Types\SwissWindsurfTypeType::PASSIVE => 'Passif',
        ];

        parent::__construct($config);
    }
}
