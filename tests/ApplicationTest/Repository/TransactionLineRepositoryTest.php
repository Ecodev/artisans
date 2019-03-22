<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Account;
use Application\Model\Transaction;
use Application\Model\TransactionLine;
use Cake\Chronos\Date;

/**
 * @group Repository
 */
class TransactionLineRepositoryTest extends AbstractRepositoryTest
{
    public function testFindByDebitOrCredit(): void
    {
        $account = _em()->getReference(Account::class, 10096);
        self::assertCount(4, $account->getTransactionLines(), 'Account must have 4 transactions');

        $transaction = new Transaction();
        $transaction->setName('foo');
        $transaction->setTransactionDate(Date::today());
        _em()->persist($transaction);

        $transactionLine = new TransactionLine();
        _em()->persist($transactionLine);
        $transactionLine->setTransaction($transaction);
        $transactionLine->setTransactionDate(Date::today());
        $transactionLine->setDebit($account);
        $transactionLine->setBalance('20');

        $transactionLine2 = new TransactionLine();
        _em()->persist($transactionLine2);
        $transactionLine2->setTransaction($transaction);
        $transactionLine2->setTransactionDate(Date::today());
        $transactionLine2->setCredit($account);
        $transactionLine2->setBalance('20');

        _em()->flush();

        self::assertCount(6, $account->getTransactionLines(), 'Account must have two new transactions');

        $otherAccount = _em()->getReference(Account::class, 10035);
        $transactionLine->setDebit($otherAccount);
        _em()->flush();

        self::assertCount(5, $account->getTransactionLines(), 'Original account with one less transaction');
        self::assertSame($transactionLine->getDebit(), $otherAccount);
    }
}