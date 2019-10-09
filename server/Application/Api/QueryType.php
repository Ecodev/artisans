<?php

declare(strict_types=1);

namespace Application\Api;

use Application\Api\Field\Query\BankingInfos;
use Application\Api\Field\Query\NextUserCode;
use Application\Api\Field\Query\Permissions;
use Application\Api\Field\Query\UserByToken;
use Application\Api\Field\Query\Viewer;
use Application\Api\Field\Standard;
use Application\Model\File;
use Application\Model\Image;
use Application\Model\Message;
use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\Product;
use Application\Model\ProductTag;
use Application\Model\User;
use Application\Model\UserTag;
use GraphQL\Type\Definition\ObjectType;

class QueryType extends ObjectType
{
    public function __construct()
    {
        $specializedFields = [
            Viewer::build(),
            UserByToken::build(),
            Permissions::build(),
            BankingInfos::build(),
            NextUserCode::build(),
        ];

        $fields = array_merge(
            $specializedFields,

            Standard::buildQuery(Product::class),
            Standard::buildQuery(ProductTag::class),
            Standard::buildQuery(Image::class),
            Standard::buildQuery(User::class),
            Standard::buildQuery(UserTag::class),
            Standard::buildQuery(File::class),
            Standard::buildQuery(Message::class),
            Standard::buildQuery(Order::class),
            Standard::buildQuery(OrderLine::class),
        );

        $config = [
            'fields' => $fields,
        ];

        parent::__construct($config);
    }
}
