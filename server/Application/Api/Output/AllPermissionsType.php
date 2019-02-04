<?php

declare(strict_types=1);

namespace Application\Api\Output;

use GraphQL\Type\Definition\ObjectType;

class AllPermissionsType extends ObjectType
{
    public function __construct()
    {
        $config = [
            'name' => 'AllPermissions',
            'description' => 'Describe permissions for current user',
            'fields' => [
                'crud' => [
                    'type' => self::nonNull(_types()->get(CrudPermissionsListType::class)),
                    'description' => 'Permissions for object creation',
                ],
            ],
        ];

        parent::__construct($config);
    }
}
