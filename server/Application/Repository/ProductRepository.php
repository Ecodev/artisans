<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\User;
use Ecodev\Felix\Repository\LimitedAccessSubQuery;

class ProductRepository extends AbstractRepository implements LimitedAccessSubQuery
{
    /**
     * Returns pure SQL to get ID of all objects that are accessible to given user.
     *
     * A user can access a file if at least one of the following condition is true:
     *
     * - product is active
     * - he is facilitator or administrator
     *
     * @param null|User $user
     */
    public function getAccessibleSubQuery(?\Ecodev\Felix\Model\User $user): string
    {
        if ($user && in_array($user->getRole(), [User::ROLE_FACILITATOR, User::ROLE_ADMINISTRATOR], true)) {
            return $this->getAllIdsQuery();
        }

        return 'SELECT id FROM product WHERE product.is_active';
    }

    // Set random sorting on all products
    public function randomizeSorting(): void
    {
        $count = $this->getCount();

        if ($count) {
            $connection = $this->getEntityManager()->getConnection();
            $connection->executeUpdate('UPDATE ' . $this->getClassMetadata()->getTableName() . ' SET sorting = FLOOR(1 + RAND() * ?)', [$count]);
        }
    }
}
