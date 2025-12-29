<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Organization;
use Application\Model\Product;
use Application\Model\User;
use Application\Repository\ProductRepository;
use ApplicationTest\Traits\LimitedAccessSubQuery;

class ProductRepositoryTest extends AbstractRepository
{
    use LimitedAccessSubQuery;

    private ProductRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Product::class);
    }

    public static function providerGetAccessibleSubQuery(): iterable
    {
        $all = range(3000, 3011);
        $actives = array_values(array_diff($all, [3010]));
        yield ['anonymous', $actives];
        yield ['member', $actives];
        yield ['othermember', $actives];
        yield ['facilitator', $all];
        yield ['administrator', $all];
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
