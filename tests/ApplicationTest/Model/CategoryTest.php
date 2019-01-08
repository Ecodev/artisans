<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Category;
use Application\Model\Transaction;
use PHPUnit\Framework\TestCase;

class CategoryTest extends TestCase
{
    public function testTree(): void
    {
        $a = new Category();
        $b = new Category();
        $c = new Category();
        $d = new Category();

        $b->addParent($a);
        $c->addParent($a);

        self::assertCount(2, $a->getChildren());

        $d->addParent($b);
        $d->addParent($c);

        self::assertCount(2, $d->getParents());
        self::assertCount(1, $b->getChildren());
        self::assertCount(1, $c->getChildren());
    }

    public function testTransactionRelation(): void
    {
        $transaction = new Transaction();
        $category = new Category();

        $transaction->setCategory($category);

        self::assertCount(1, $category->getTransactions());

        self::assertSame($transaction->getCategory(), $category);

        $transaction2 = new Transaction();
        $category2 = new Category();
        $transaction->setCategory($category2);
        $transaction2->setCategory($category2);
        self::assertCount(0, $category->getTransactions());
        self::assertCount(2, $category2->getTransactions());
    }
}
