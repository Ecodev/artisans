<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Sorting;

use Application\Model\Product;
use Application\Model\User;
use Ecodev\Felix\Testing\Api\Input\Sorting\AbstractSorting;

class IllustrationTest extends AbstractSorting
{
    public function testSorting(): void
    {
        $result = _em()->getRepository(User::class)->getAclFilter()->runWithoutAcl(function () {
            return $this->getSortedQueryResult(_types(), Product::class, 'illustration');
        });

        self::assertSame([
            3000,
            3001,
            3002,
            3003,
            3004,
            3005,
            3006,
            3007,
            3008,
            3009,
            3010,
            3011,
        ], $result);
    }
}
