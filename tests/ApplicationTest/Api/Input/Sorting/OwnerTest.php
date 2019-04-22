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
            8000,
            8002,
            8006,
            8005,
            8007,
            8001,
            8003,
            8004,
        ], $result);
    }
}
