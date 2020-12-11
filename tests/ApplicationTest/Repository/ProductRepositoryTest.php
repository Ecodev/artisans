<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Organization;
use Application\Model\Product;
use Application\Model\User;
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

    protected function setUp(): void
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

    public function testGetSubscriptionLastReviewNumber(): void
    {
        $user = $this->getEntityManager()->getReference(User::class, 1000);
        $actual = $this->repository->getSubscriptionLastReviewNumber($user);
        self::assertNull($actual);

        $user = $this->getEntityManager()->getReference(User::class, 1003);
        $actual = $this->repository->getSubscriptionLastReviewNumber($user);
        self::assertSame(62, $actual);

        $organization = $this->getEntityManager()->getReference(Organization::class, 50000);
        $actual = $this->repository->getSubscriptionLastReviewNumber($organization);
        self::assertSame(61, $actual);
    }
}
