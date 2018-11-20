<?php

declare(strict_types=1);

namespace Application\Api;

use Application\Api\Field\Query\Viewer;
use Application\Api\Field\Standard;
use Application\Model\Booking;
use Application\Model\Country;
use Application\Model\Resource;
use Application\Model\Tag;
use Application\Model\User;
use GraphQL\Type\Definition\ObjectType;

class QueryType extends ObjectType
{
    public function __construct()
    {
        $specializedFields = [
            Viewer::build(),
        ];

        $fields = array_merge(
            $specializedFields,

            Standard::buildQuery(Booking::class),
            Standard::buildQuery(Country::class),
            Standard::buildQuery(Resource::class),
            Standard::buildQuery(Tag::class),
            Standard::buildQuery(User::class)
        );

        $config = [
            'fields' => $fields,
        ];

        parent::__construct($config);
    }
}
