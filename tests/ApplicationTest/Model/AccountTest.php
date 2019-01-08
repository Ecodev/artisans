<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Account;
use Application\Model\Transaction;
use Application\Model\User;
use PHPUnit\Framework\TestCase;

class AccountTest extends TestCase
{
    public function testUserRelation(): void
    {
        $account = new Account();
        self::assertNull($account->getUser());

        $user = new User();
        $account->setUser($user);

        self::assertSame($account->getUser(), $user);
        self::assertSame($account, $user->getAccount());

        $otherUser = new User();
        $account->setUser($otherUser);
        self::assertNull($user->getAccount(), 'First user must have no account');

        $account->setUser(null);
        self::assertNull($account->getUser(), 'Account must have no user');
        self::assertNull($user->getAccount(), 'User must have no account');
    }

    public function testTransactionRelation(): void
    {
        $account = new Account();

        $transaction = new Transaction();
        $transaction->setAccount($account);

        self::assertCount(1, $account->getTransactions(), 'Account must have 1 transaction');

        $otherAccount = new Account();
        $transaction->setAccount($otherAccount);

        self::assertCount(0, $account->getTransactions(), 'Original account without transaction');

        self::assertSame($transaction->getAccount(), $otherAccount);
    }
}
