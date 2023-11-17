<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Message;
use Application\Repository\MessageRepository;
use ApplicationTest\Traits\LimitedAccessSubQuery;

class MessageRepositoryTest extends AbstractRepositoryTest
{
    use LimitedAccessSubQuery;

    private MessageRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Message::class);
    }

    public function providerGetAccessibleSubQuery(): iterable
    {
        // Nobody can see all messages for now, even administrator, because it's useless
        $all = [11001, 11002];
        yield ['anonymous', []];
        yield ['member', [11001]];
        yield ['facilitator', [11002]];
        yield ['administrator', []];
    }
}
