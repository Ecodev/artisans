<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\User;

class FileRepository extends AbstractRepository implements LimitedAccessSubQueryInterface
{
    /**
     * Returns pure SQL to get ID of all objects that are accessible to given user.
     *
     * @param null|User $user
     *
     * @return string
     */
    public function getAccessibleSubQuery(?User $user): string
    {
        if (!$user) {
            return '-1';
        }

        if (in_array($user->getRole(), [User::ROLE_FACILITATOR, User::ROLE_ADMINISTRATOR], true)) {
            return $this->getAllIdsQuery();
        }

        return '
SELECT file.id FROM file
INNER JOIN product p ON file.product_id = p.id AND p.is_active
INNER JOIN user_product ON p.id = user_product.product_id AND user_product.user_id = ' . $this->getEntityManager()->getConnection()->quote($user->getId()) . '
';
    }
}
