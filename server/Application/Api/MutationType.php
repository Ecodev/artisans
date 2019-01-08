<?php

declare(strict_types=1);

namespace Application\Api;

use Application\Api\Field\Mutation\Login;
use Application\Api\Field\Mutation\Logout;
use Application\Api\Field\Mutation\OpenDoor;
use Application\Api\Field\Mutation\TerminateBooking;
use Application\Api\Field\Standard;
use Application\Model\Account;
use Application\Model\AccountingDocument;
use Application\Model\Bookable;
use Application\Model\BookableMetadata;
use Application\Model\BookableTag;
use Application\Model\Booking;
use Application\Model\Category;
use Application\Model\ExpenseClaim;
use Application\Model\Image;
use Application\Model\License;
use Application\Model\Message;
use Application\Model\Transaction;
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
            OpenDoor::build(),
            TerminateBooking::build(),
        ];

        $fields = array_merge(
            $specializedFields,

            Standard::buildMutation(Bookable::class),
            Standard::buildMutation(BookableMetadata::class),
            Standard::buildMutation(BookableTag::class),
            Standard::buildMutation(Booking::class),
            Standard::buildMutation(Image::class),
            Standard::buildMutation(License::class),
            Standard::buildMutation(User::class),
            Standard::buildMutation(UserTag::class),
            Standard::buildMutation(Account::class),
            Standard::buildMutation(Transaction::class),
            Standard::buildMutation(Category::class),
            Standard::buildMutation(ExpenseClaim::class),
            Standard::buildMutation(AccountingDocument::class),
            Standard::buildMutation(Message::class),
            Standard::buildRelationMutation(Booking::class, Bookable::class),
            Standard::buildRelationMutation(License::class, Bookable::class),
            Standard::buildRelationMutation(License::class, User::class),
            Standard::buildRelationMutation(UserTag::class, User::class),
            Standard::buildRelationMutation(BookableTag::class, Bookable::class),
            Standard::buildRelationMutation(Category::class, Category::class)
        );

        $config = [
            'fields' => $fields,
        ];

        parent::__construct($config);
    }
}
