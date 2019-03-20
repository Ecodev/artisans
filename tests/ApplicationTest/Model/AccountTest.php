<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Account;
use Application\Model\TransactionLine;
use Application\Model\User;
use Doctrine\DBAL\Exception\InvalidArgumentException;
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

    public function testTree(): void
    {
        $a = new Account();
        $b = new Account();
        $c = new Account();

        $b->setParent($a);
        $c->setParent($a);

        self::assertCount(2, $a->getChildren());

        $c->setParent(null);

        self::assertCount(1, $a->getChildren());
    }

    public function testTransactionRelation(): void
    {
        $account = _em()->getReference(Account::class, 10096);

        $transactionLine = new TransactionLine();
        $transactionLine->setDebit($account);

        $transactionLine2 = new TransactionLine();
        $transactionLine2->setCredit($account);

        self::assertCount(5, $account->getTransactionLines(), 'Account must have 5 transactions');

        $otherAccount = _em()->getReference(Account::class, 10035);
        $transactionLine->setDebit($otherAccount);

        self::assertCount(4, $account->getTransactionLines(), 'Original account with 4 transaction');

        self::assertSame($transactionLine->getDebit(), $otherAccount);
    }

    public function testIban(): void
    {
        $account = new Account();

        self::assertEmpty($account->getIban());

        $iban = 'CH6303714697192579556';
        $account->setIban($iban);
        self::assertSame($iban, $account->getIban());

        $this->expectException(InvalidArgumentException::class);
        $invalidIban = 'CH123456789012345678';
        $account->setIban($invalidIban);
    }
}
