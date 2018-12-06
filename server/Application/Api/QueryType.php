<?php

declare(strict_types=1);

namespace Application\Api;

use Application\Api\Field\Query\Viewer;
use Application\Api\Field\Standard;
use Application\Model\Bookable;
use Application\Model\Booking;
use Application\Model\Country;
use Application\Model\License;
use Application\Model\User;
use Application\Model\UserTag;
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
            Standard::buildQuery(Bookable::class),
            Standard::buildQuery(License::class),
            Standard::buildQuery(User::class),
            Standard::buildQuery(UserTag::class)
        );

        $config = [
            'fields' => $fields,
        ];

        parent::__construct($config);
    }
}
