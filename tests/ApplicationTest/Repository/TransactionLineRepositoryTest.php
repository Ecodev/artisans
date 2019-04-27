<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\TransactionLine;
use Application\Repository\TransactionLineRepository;
use ApplicationTest\Traits\LimitedAccessSubQuery;

/**
 * @group Repository
 */
class TransactionLineRepositoryTest extends AbstractRepositoryTest
{
    use LimitedAccessSubQuery;

    /**
     * @var TransactionLineRepository
     */
    private $repository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(TransactionLine::class);
    }

    public function providerGetAccessibleSubQuery(): array
    {
        $all = range(14000, 14008);
        $family = [14005, 14006, 14007, 14008];

        return [
            ['anonymous', []],
            ['individual', $family],
            ['member', $family],
            ['responsible', $all],
            ['administrator', $all],
        ];
    }
}
