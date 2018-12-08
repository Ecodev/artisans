<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use GraphQL\Type\Definition\EnumType;

class SexType extends EnumType
{
    public function __construct()
    {
        $config = [
            'name' => 'Sex',
            'description' => 'The ISO/IEC 5218 sex',
            'values' => [
                'not_known' => [
                    'value' => 0,
                    'description' => 'inconnu',
                ],
                'male' => [
                    'value' => 1,
                    'description' => 'masculin',
                ],
                'female' => [
                    'value' => 2,
                    'description' => 'féminin',
                ],
                'not_applicable' => [
                    'value' => 9,
                    'description' => 'sans objet',
                ],
            ],
        ];

        parent::__construct($config);
    }
}
