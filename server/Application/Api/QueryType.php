<?php

declare(strict_types=1);

namespace Application\Api;

use Application\Api\Field\Query\Configuration;
use Application\Api\Field\Query\Permissions;
use Application\Api\Field\Query\Purchases;
use Application\Api\Field\Query\UserByToken;
use Application\Api\Field\Query\UserRolesAvailable;
use Application\Api\Field\Query\Viewer;
use Application\Api\Field\Standard;
use Application\Model\Comment;
use Application\Model\Country;
use Application\Model\Event;
use Application\Model\FacilitatorDocument;
use Application\Model\File;
use Application\Model\Image;
use Application\Model\News;
use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\Product;
use Application\Model\ProductTag;
use Application\Model\Session;
use Application\Model\Subscription;
use Application\Model\User;
use Ecodev\Felix\Utility;
use GraphQL\Type\Definition\ObjectType;

class QueryType extends ObjectType
{
    public function __construct()
    {
        $fields = Utility::concat(
            // Specialized fields
            Viewer::build(),
            UserByToken::build(),
            Permissions::build(),
            Purchases::build(),
            Configuration::build(),
            UserRolesAvailable::build(),

            // Standard fields
            Standard::buildQuery(Event::class),
            Standard::buildQuery(File::class),
            Standard::buildQuery(Image::class),
            Standard::buildQuery(News::class),
            Standard::buildQuery(Order::class),
            Standard::buildQuery(OrderLine::class),
            Standard::buildQuery(Product::class),
            Standard::buildQuery(ProductTag::class),
            Standard::buildQuery(Session::class),
            Standard::buildQuery(Subscription::class),
            Standard::buildQuery(User::class),
            Standard::buildQuery(Country::class),
            Standard::buildQuery(Comment::class),
            Standard::buildQuery(FacilitatorDocument::class),
        );

        $config = [
            'fields' => $fields,
        ];

        parent::__construct($config);
    }
}
