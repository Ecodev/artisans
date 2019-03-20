<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\TransactionLine;
use Application\Model\TransactionTag;
use PHPUnit\Framework\TestCase;

class TransactionTagTest extends TestCase
{
    public function testTransactionLineRelation(): void
    {
        $transactionLine = new TransactionLine();
        $tag = new TransactionTag();

        $transactionLine->setTransactionTag($tag);

        self::assertCount(1, $tag->getTransactionLines());

        self::assertSame($transactionLine->getTransactionTag(), $tag);

        $transactionLine2 = new TransactionLine();
        $tag2 = new TransactionTag();
        $transactionLine->setTransactionTag($tag2);
        $transactionLine2->setTransactionTag($tag2);
        self::assertCount(0, $tag->getTransactionLines());
        self::assertCount(2, $tag2->getTransactionLines());
    }
}
