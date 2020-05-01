<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Product;
use Application\Repository\ProductRepository;
use ApplicationTest\Traits\LimitedAccessSubQuery;

/**
 * @group Repository
 */
class ProductRepositoryTest extends AbstractRepositoryTest
{
    use LimitedAccessSubQuery;

    /**
     * @var ProductRepository
     */
    private $repository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Product::class);
    }

    public function providerGetAccessibleSubQuery(): array
    {
        $all = range(3000, 3011);
        $actives = array_values(array_diff($all, [3010]));

        return [
            ['anonymous', $actives],
            ['member', $actives],
            ['othermember', $actives],
            ['facilitator', $all],
            ['administrator', $all],
        ];
    }
}
