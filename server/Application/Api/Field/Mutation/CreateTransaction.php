<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Exception;
use Application\Api\Field\FieldInterface;
use Application\Api\Helper;
use Application\Model\Transaction;
use Application\Model\TransactionLine;
use GraphQL\Type\Definition\Type;
use Zend\Expressive\Session\SessionInterface;

abstract class CreateTransaction implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'createTransaction',
            'type' => Type::nonNull(_types()->getOutput(Transaction::class)),
            'description' => 'Create a transaction with all its transaction lines. Everything will be read-only forever.',
            'args' => [
                'input' => Type::nonNull(_types()->getInput(Transaction::class)),
                'lines' => Type::nonNull(Type::listOf(Type::nonNull(_types()->getInput(TransactionLine::class)))),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): Transaction {
                // Do it
                $transaction = new Transaction();
                $input = $args['input'];
                Helper::hydrate($transaction, $input);

                // Check ACL
                Helper::throwIfDenied($transaction, 'create');

                $accounts = [];
                foreach ($args['lines'] as $line) {
                    $transactionLine = new TransactionLine();
                    Helper::hydrate($transactionLine, $line);
                    if (!$transactionLine->getCredit() && !$transactionLine->getDebit()) {
                        throw new Exception('Cannot create a transaction line without any account');
                    }
                    $accounts[] = $transactionLine->getCredit();
                    $accounts[] = $transactionLine->getDebit();

                    $transactionLine->setTransaction($transaction);
                    _em()->persist($transactionLine);
                }

                _em()->persist($transaction);
                _em()->flush();

                // Be sure to refresh the new account balance that were computed by DB triggers
                $accounts = array_filter(array_unique($accounts, SORT_REGULAR));
                foreach ($accounts as $account) {
                    _em()->refresh($account);
                }

                return $transaction;
            },
        ];
    }
}
