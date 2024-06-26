<?php

declare(strict_types=1);

namespace Application\Api\Output;

use Application\Acl\Acl;
use Application\Model\AbstractModel;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;

class CrudPermissionsType extends ObjectType
{
    public function __construct()
    {
        $config = [
            'name' => 'CrudPermissions',
            'description' => 'Describe global permissions for currently logged in user',
            'fields' => [
                'create' => [
                    'type' => self::nonNull(self::boolean()),
                    'description' => 'Whether the user can create',
                    'resolve' => function ($root, array $args, $context, ResolveInfo $info): bool {
                        /** @var class-string<AbstractModel> $type */
                        $type = $root['type'];

                        $instance = new $type();
                        $acl = new Acl();

                        return $acl->isCurrentUserAllowed($instance, 'create');
                    },
                ],
            ],
        ];

        parent::__construct($config);
    }
}
