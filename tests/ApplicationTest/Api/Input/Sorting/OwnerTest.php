<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Sorting;

use Application\Model\Transaction;
use Application\Model\User;

class OwnerTest extends AbstractSorting
{
    public function setUp(): void
    {
        parent::setUp();
        _em()->getRepository(User::class)->getAclFilter()->setEnabled(false);
    }

    public function tearDown(): void
    {
        parent::tearDown();
        _em()->getRepository(User::class)->getAclFilter()->setEnabled(true);
    }

    public function testSorting(): void
    {
        $result = $this->getSortedQueryResult(Transaction::class, 'owner');
        self::assertSame([
            8004,
            8000,
            8001,
            8003,
            8005,
        ], $result);
    }
}
