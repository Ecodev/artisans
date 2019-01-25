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
        self::assertNull($account->getOwner());

        $user = new User();
        User::setCurrent($user);
        $account->setOwner($user);

        self::assertSame($account->getOwner(), $user);
        self::assertSame($account, $user->getAccount());

        $otherUser = new User();
        $account->setOwner($otherUser);
        self::assertSame($otherUser, $account->getOwner(), 'Account must have second user');
        self::assertNull($user->getAccount(), 'First user must have no account');
        self::assertSame($account, $otherUser->getAccount(), 'second user must have account');

        User::setCurrent($otherUser);
        $account->setOwner(null);
        self::assertNull($account->getOwner(), 'Account must have no user');
        self::assertNull($user->getAccount(), 'First user must have no account');
        self::assertNull($otherUser->getAccount(), 'Second user must have no account');
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
