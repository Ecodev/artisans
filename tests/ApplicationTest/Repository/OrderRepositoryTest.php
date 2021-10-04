<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Order;
use Application\Repository\OrderRepository;
use ApplicationTest\Traits\LimitedAccessSubQuery;

/**
 * @group Repository
 */
class OrderRepositoryTest extends AbstractRepositoryTest
{
    use LimitedAccessSubQuery;

    /**
     * @var OrderRepository
     */
    private $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Order::class);
    }

    public function providerGetAccessibleSubQuery(): array
    {
        $all = [16000, 16001, 16002, 16003, 16004];
        $family = $all;

        return [
            ['anonymous', []],
            ['member', [16000, 16004]],
            ['facilitator', $all],
            ['administrator', $all],
        ];
    }
}
