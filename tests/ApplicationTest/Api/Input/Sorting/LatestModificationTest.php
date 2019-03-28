<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Sorting;

use Application\Model\ExpenseClaim;

class LatestModificationTest extends AbstractSorting
{
    public function testSorting(): void
    {
        $result = $this->getSortedQueryResult(ExpenseClaim::class, 'latestModification');
        self::assertSame([
            7002,
            7001,
            7000,
        ], $result);
    }
}
