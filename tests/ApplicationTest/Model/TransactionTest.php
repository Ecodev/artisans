<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Bookable;
use Application\Model\Transaction;
use PHPUnit\Framework\TestCase;

class TransactionTest extends TestCase
{
    public function testBookableRelation(): void
    {
        $bookable = new Bookable();

        $transaction = new Transaction();

        $transaction->setBookable($bookable);

        self::assertCount(1, $bookable->getTransactions());

        $transaction->setBookable(null);

        self::assertCount(0, $bookable->getTransactions());
    }
}
