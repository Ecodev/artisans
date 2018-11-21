<?php

declare(strict_types=1);

namespace Application\Api;

use Application\Api\Field\Mutation\Login;
use Application\Api\Field\Mutation\Logout;
use Application\Api\Field\Standard;
use Application\Model\Booking;
use Application\Model\Resource;
use Application\Model\Tag;
use Application\Model\User;
use GraphQL\Type\Definition\ObjectType;

class MutationType extends ObjectType
{
    public function __construct()
    {
        $specializedFields = [
            Login::build(),
            Logout::build(),
        ];

        $fields = array_merge(
            $specializedFields,

            Standard::buildMutation(Booking::class),
            Standard::buildMutation(Resource::class),
            Standard::buildMutation(User::class),
            Standard::buildRelationMutation(Booking::class, Resource::class),
            Standard::buildRelationMutation(Tag::class, Resource::class)
        );

        $config = [
            'fields' => $fields,
        ];

        parent::__construct($config);
    }
}
