<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Sorting;

use Application\Model\Booking;

class OwnerTest extends AbstractSorting
{
    public function testSorting(): void
    {
        $result = $this->getSortedQueryResult(Booking::class, 'owner');
        self::assertSame([
            4000,
            4001,
            4003,
            4004,
            4005,
            4006,
            4007,
            4009,
            4012,
            4013,
            4014,
            4015,
        ], $result);
    }
}
