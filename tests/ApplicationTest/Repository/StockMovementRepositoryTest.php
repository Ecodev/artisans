<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\StockMovement;
use Application\Repository\StockMovementRepository;
use ApplicationTest\Traits\LimitedAccessSubQuery;

/**
 * @group Repository
 */
class StockMovementRepositoryTest extends AbstractRepositoryTest
{
    use LimitedAccessSubQuery;

    /**
     * @var StockMovementRepository
     */
    private $repository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(StockMovement::class);
    }

    public function providerGetAccessibleSubQuery(): array
    {
        $all = range(18000, 18021);

        return [
            ['anonymous', []],
            ['individual', []],
            ['member', []],
            ['responsible', $all],
            ['administrator', $all],
        ];
    }
}
