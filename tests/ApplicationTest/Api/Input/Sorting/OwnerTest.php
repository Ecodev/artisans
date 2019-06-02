<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Sorting;

use Application\Model\Transaction;
use Application\Model\User;

class OwnerTest extends AbstractSorting
{
    public function testSorting(): void
    {
        $result = _em()->getRepository(User::class)->getAclFilter()->runWithoutAcl(function () {
            return $this->getSortedQueryResult(Transaction::class, 'owner');
        });

        self::assertSame([
            8004,
            8000,
            8001,
            8003,
            8005,
            8006,
        ], $result);
    }
}
