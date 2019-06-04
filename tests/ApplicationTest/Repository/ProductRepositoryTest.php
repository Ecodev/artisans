<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Product;
use Application\Repository\ProductRepository;

/**
 * @group Repository
 */
class ProductRepositoryTest extends AbstractRepositoryTest
{
    /**
     * @var ProductRepository
     */
    private $repository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Product::class);
    }

    public function testDisableAllDiscountablePrices(): void
    {
        self::assertGreaterThan(0, $this->repository->count(['ponderatePrice' => 1]));
        $this->repository->disableAllDiscountablePrices();
        self::assertEquals(0, $this->repository->count(['ponderatePrice' => 1]));
    }
}
