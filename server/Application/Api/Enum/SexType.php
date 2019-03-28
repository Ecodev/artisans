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
            'description' => 'Genders',
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
            ],
        ];

        parent::__construct($config);
    }
}
