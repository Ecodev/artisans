<?php

declare(strict_types=1);

namespace Application\Api;

use Application\Api\Field\Mutation\ConfirmRegistration;
use Application\Api\Field\Mutation\CreateOrder;
use Application\Api\Field\Mutation\Login;
use Application\Api\Field\Mutation\Logout;
use Application\Api\Field\Mutation\Register;
use Application\Api\Field\Mutation\RequestPasswordReset;
use Application\Api\Field\Mutation\Unregister;
use Application\Api\Field\Mutation\UpdateConfiguration;
use Application\Api\Field\Mutation\UpdateOrderLine;
use Application\Api\Field\Mutation\UpdatePassword;
use Application\Api\Field\Standard;
use Application\Model\Event;
use Application\Model\File;
use Application\Model\Image;
use Application\Model\News;
use Application\Model\Newsletter;
use Application\Model\Product;
use Application\Model\ProductTag;
use Application\Model\Session;
use Application\Model\Subscription;
use Application\Model\User;
use Application\Model\UserTag;
use GraphQL\Type\Definition\ObjectType;

class MutationType extends ObjectType
{
    public function __construct()
    {
        $specializedFields = [
            Login::build(),
            Logout::build(),
            RequestPasswordReset::build(),
            UpdatePassword::build(),
            Register::build(),
            ConfirmRegistration::build(),
            Unregister::build(),
            CreateOrder::build(),
            UpdateOrderLine::build(),
            UpdateConfiguration::build(),
        ];

        $fields = array_merge(
            $specializedFields,

            Standard::buildMutation(Event::class),
            Standard::buildMutation(File::class),
            Standard::buildMutation(File::class),
            Standard::buildMutation(Image::class),
            Standard::buildMutation(News::class),
            Standard::buildMutation(Newsletter::class),
            Standard::buildMutation(Product::class),
            Standard::buildMutation(ProductTag::class),
            Standard::buildMutation(Session::class),
            Standard::buildMutation(Subscription::class),
            Standard::buildMutation(User::class),
            Standard::buildMutation(UserTag::class),
            Standard::buildRelationMutation(UserTag::class, User::class),
            Standard::buildRelationMutation(ProductTag::class, Product::class),
            Standard::buildRelationMutation(Session::class, User::class, 'Facilitator'),
        );

        $config = [
            'fields' => $fields,
        ];

        parent::__construct($config);
    }
}
