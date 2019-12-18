<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\DBAL\Types\ProductTypeType;
use Application\Model\User;

class FileRepository extends AbstractRepository implements LimitedAccessSubQueryInterface
{
    /**
     * Returns pure SQL to get ID of all objects that are accessible to given user.
     *
     * Give access to users that have flag webTemporaryAccess or to users that have web subscription (digital/both)
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

        if (!$user->getWebTemporaryAccess() && !in_array($user->getSubscriptionType(), [ProductTypeType::BOTH, ProductTypeType::DIGITAL], true)) {
            $webTypesSql = '(' .
                $this->getEntityManager()->getConnection()->quote(ProductTypeType::BOTH) . ', ' .
                $this->getEntityManager()->getConnection()->quote(ProductTypeType::DIGITAL) .
                ')';

            return '
SELECT file.id FROM file
INNER JOIN product p ON file.product_id = p.id AND p.is_active and p.type IN ' . $webTypesSql . '
';
        }

        return '';
    }
}
