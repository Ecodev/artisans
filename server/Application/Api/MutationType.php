<?php

declare(strict_types=1);

namespace Application\Api;

use Application\Api\Field\Mutation\ConfirmRegistration;
use Application\Api\Field\Mutation\CreateTransaction;
use Application\Api\Field\Mutation\LeaveFamily;
use Application\Api\Field\Mutation\Login;
use Application\Api\Field\Mutation\Logout;
use Application\Api\Field\Mutation\OpenDoor;
use Application\Api\Field\Mutation\Register;
use Application\Api\Field\Mutation\RequestPasswordReset;
use Application\Api\Field\Mutation\Unregister;
use Application\Api\Field\Mutation\UpdatePassword;
use Application\Api\Field\Mutation\UpdateTransaction;
use Application\Api\Field\Standard;
use Application\Model\Account;
use Application\Model\AccountingDocument;
use Application\Model\Bookable;
use Application\Model\BookableMetadata;
use Application\Model\BookableTag;
use Application\Model\ExpenseClaim;
use Application\Model\Image;
use Application\Model\Transaction;
use Application\Model\TransactionTag;
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
            RequestPasswordReset::build(),
            UpdatePassword::build(),
            Register::build(),
            ConfirmRegistration::build(),
            Unregister::build(),
            LeaveFamily::build(),
            CreateTransaction::build(),
            UpdateTransaction::build(),
            Standard::buildMutation(Transaction::class)[2], // Only delete mutation
        ];

        $fields = array_merge(
            $specializedFields,

            Standard::buildMutation(Bookable::class),
            Standard::buildMutation(BookableMetadata::class),
            Standard::buildMutation(BookableTag::class),
            Standard::buildMutation(Image::class),
            Standard::buildMutation(User::class),
            Standard::buildMutation(UserTag::class),
            Standard::buildMutation(Account::class),
            Standard::buildMutation(TransactionTag::class),
            Standard::buildMutation(ExpenseClaim::class),
            Standard::buildMutation(AccountingDocument::class),
            Standard::buildRelationMutation(UserTag::class, User::class),
            Standard::buildRelationMutation(BookableTag::class, Bookable::class),
            Standard::buildRelationMutation(Account::class, Account::class, 'Parent')
        );

        $config = [
            'fields' => $fields,
        ];

        parent::__construct($config);
    }
}
