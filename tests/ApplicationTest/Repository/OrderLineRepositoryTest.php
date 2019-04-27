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
        $all = range(17000, 17006);
        $family = $all;

        return [
            ['anonymous', []],
            ['individual', $family],
            ['member', $family],
            ['responsible', $all],
            ['administrator', $all],
        ];
    }
}
