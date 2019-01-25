<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\AccountingDocument;
use Application\Model\ExpenseClaim;
use Application\Model\Transaction;
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
}
