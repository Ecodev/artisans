<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Sorting;

use Application\Model\Message;
use Application\Model\User;

class OwnerTest extends AbstractSorting
{
    public function testSorting(): void
    {
        $result = _em()->getRepository(User::class)->getAclFilter()->runWithoutAcl(function () {
            return $this->getSortedQueryResult(Message::class, 'owner');
        });

        self::assertSame([
            11002,
            11001,
        ], $result);
    }
}
