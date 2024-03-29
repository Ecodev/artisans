<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Organization;
use Application\Model\Product;
use Application\Model\User;

use Ecodev\Felix\Repository\LimitedAccessSubQuery;

/**
 * @extends AbstractRepository<Product>
 */
class ProductRepository extends AbstractRepository implements LimitedAccessSubQuery
{
    /**
     * Returns pure SQL to get ID of all objects that are accessible to given user.
     *
     * A user can access a file if at least one of the following conditions is true:
     *
     * - product is active
     * - he is facilitator or administrator
     *
     * @param null|User $user
     */
    public function getAccessibleSubQuery(?\Ecodev\Felix\Model\User $user): string
    {
        if ($user && in_array($user->getRole(), [User::ROLE_FACILITATOR, User::ROLE_ADMINISTRATOR], true)) {
            return '';
        }

        return 'SELECT id FROM product WHERE product.is_active';
    }

    // Set random sorting on all products
    public function randomizeSorting(): void
    {
        $count = $this->getCount();

        if ($count) {
            $connection = $this->getEntityManager()->getConnection();
            $connection->executeStatement('UPDATE ' . $this->getClassMetadata()->getTableName() . ' SET sorting = FLOOR(1 + RAND() * ?)', [$count]);
        }
    }

    public function getSubscriptionLastReviewNumber(Organization|User $hasSubscriptionLastReview): ?int
    {
        $class = $hasSubscriptionLastReview::class;
        $table = $this->getEntityManager()->getClassMetadata($class)->getTableName();

        $connection = $this->getEntityManager()->getConnection();

        $sql = "SELECT review_number FROM product INNER JOIN $table ON $table.subscription_last_review_id = product.id AND $table.id = " . $hasSubscriptionLastReview->getId();
        $result = $connection->fetchOne($sql);

        if (is_numeric($result)) {
            $result = (int) $result;
        } else {
            $result = null;
        }

        return $result;
    }

    public function getIds(): array
    {
        $query = $this->createQueryBuilder('product')
            ->select('product.id, product.reviewNumber')
            ->where('product.isActive = true')
            ->orderBy('product.id')
            ->getQuery();

        $result = $query->getArrayResult();

        return $result;
    }
}
