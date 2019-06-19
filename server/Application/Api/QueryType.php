<?php

declare(strict_types=1);

namespace Application\Api;

use Application\Api\Field\Query\BankingInfos;
use Application\Api\Field\Query\NextUserCode;
use Application\Api\Field\Query\Permissions;
use Application\Api\Field\Query\UserByToken;
use Application\Api\Field\Query\Viewer;
use Application\Api\Field\Standard;
use Application\Model\Account;
use Application\Model\AccountingDocument;
use Application\Model\ExpenseClaim;
use Application\Model\Image;
use Application\Model\Message;
use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\Product;
use Application\Model\ProductMetadata;
use Application\Model\ProductTag;
use Application\Model\StockMovement;
use Application\Model\Transaction;
use Application\Model\TransactionLine;
use Application\Model\TransactionTag;
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
            Standard::buildQuery(ProductMetadata::class),
            Standard::buildQuery(ProductTag::class),
            Standard::buildQuery(Image::class),
            Standard::buildQuery(User::class),
            Standard::buildQuery(UserTag::class),
            Standard::buildQuery(Account::class),
            Standard::buildQuery(Transaction::class),
            Standard::buildQuery(TransactionLine::class),
            Standard::buildQuery(TransactionTag::class),
            Standard::buildQuery(ExpenseClaim::class),
            Standard::buildQuery(AccountingDocument::class),
            Standard::buildQuery(Message::class),
            Standard::buildQuery(Order::class),
            Standard::buildQuery(OrderLine::class),
            Standard::buildQuery(StockMovement::class)
        );

        $config = [
            'fields' => $fields,
        ];

        parent::__construct($config);
    }
}
