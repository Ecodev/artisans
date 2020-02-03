<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\OrderLine;
use Application\Repository\OrderLineRepository;
use ApplicationTest\Traits\LimitedAccessSubQuery;

/**
 * @group Repository
 */
class OrderLineRepositoryTest extends AbstractRepositoryTest
{
    use LimitedAccessSubQuery;

    /**
     * @var OrderLineRepository
     */
    private $repository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(OrderLine::class);
    }

    public function providerGetAccessibleSubQuery(): array
    {
        $all = [17000, 17001, 17002, 17003];
        $family = [17000, 17001, 17002];

        return [
            ['anonymous', []],
            ['member', $family],
            ['facilitator', $all],
            ['administrator', $all],
        ];
    }
}
