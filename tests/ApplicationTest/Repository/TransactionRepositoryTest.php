<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Transaction;
use Application\Repository\TransactionRepository;
use ApplicationTest\Traits\LimitedAccessSubQuery;

/**
 * @group Repository
 */
class TransactionRepositoryTest extends AbstractRepositoryTest
{
    use LimitedAccessSubQuery;

    /**
     * @var TransactionRepository
     */
    private $repository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Transaction::class);
    }

    public function providerGetAccessibleSubQuery(): array
    {
        $all = [8000, 8001, 8002, 8003, 8004, 8005];

        return [
            ['anonymous', []],
            ['bookingonly', []],
            ['individual', []],
            ['member', [8000, 8002, 8003, 8004]],
            ['responsible', $all],
            ['administrator', $all],
        ];
    }
}
