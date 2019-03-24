<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\AccountingDocument;
use Application\Model\Transaction;
use PHPUnit\Framework\TestCase;

class TransactionTest extends TestCase
{
    public function testDocumentRelation(): void
    {
        $document = new AccountingDocument();
        $transaction1 = new Transaction();
        $transaction2 = new Transaction();

        self::assertCount(0, $transaction1->getAccountingDocuments());
        self::assertCount(0, $transaction2->getAccountingDocuments());

        $document->setTransaction($transaction1);

        self::assertCount(1, $transaction1->getAccountingDocuments());
        self::assertCount(0, $transaction2->getAccountingDocuments());

        $document->setTransaction($transaction2);

        self::assertCount(0, $transaction1->getAccountingDocuments());
        self::assertCount(1, $transaction2->getAccountingDocuments());

        $document->setTransaction(null);
        self::assertCount(0, $transaction1->getAccountingDocuments());
        self::assertCount(0, $transaction2->getAccountingDocuments());
    }
}
