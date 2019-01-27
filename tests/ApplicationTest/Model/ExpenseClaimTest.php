<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\DBAL\Types\ExpenseClaimStatusType;
use Application\Model\AccountingDocument;
use Application\Model\ExpenseClaim;
use Application\Model\Transaction;
use Application\Model\User;
use PHPUnit\Framework\TestCase;

class ExpenseClaimTest extends TestCase
{
    public function testDocumentRelation(): void
    {
        $document = new AccountingDocument();

        $expense = new ExpenseClaim();
        $document->setExpenseClaim($expense);

        $expense2 = new ExpenseClaim();

        self::assertCount(1, $expense->getAccountingDocuments());

        $document->setExpenseClaim($expense2);

        self::assertCount(0, $expense->getAccountingDocuments());
        self::assertCount(1, $expense2->getAccountingDocuments());
    }

    public function testTransactionRelation(): void
    {
        $transaction = new Transaction();
        $transaction2 = new Transaction();

        $expense = new ExpenseClaim();

        $transaction->setExpenseClaim($expense);
        $transaction2->setExpenseClaim($expense);

        self::assertCount(2, $expense->getTransactions());

        $expense2 = new ExpenseClaim();

        $transaction2->setExpenseClaim($expense2);

        self::assertCount(1, $expense->getTransactions());
        self::assertCount(1, $expense2->getTransactions());
    }

    public function testGetPermissions(): void
    {
        $expenseClaim = new ExpenseClaim();

        $actual = $expenseClaim->getPermissions();
        $expected = [
            'create' => false,
            'read' => false,
            'update' => false,
            'delete' => false,
        ];
        self::assertEquals($expected, $actual, 'should be able to get permissions as anonymous');

        // Make the current user as creator
        $user = new User();
        User::setCurrent($user);
        $expenseClaim->timestampCreation();

        $actual2 = $expenseClaim->getPermissions();
        $expected2 = [
            'create' => true,
            'read' => true,
            'update' => true,
            'delete' => true,
        ];
        self::assertEquals($expected2, $actual2, 'should be able to get permissions as creator');

        $expenseClaim->setStatus(ExpenseClaimStatusType::PROCESSED);
        $actual3 = $expenseClaim->getPermissions();
        $expected3 = [
            'create' => true,
            'read' => true,
            'update' => false,
            'delete' => false,
        ];
        self::assertEquals($expected3, $actual3, 'should be able to get permissions as creator');
    }
}
