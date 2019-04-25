<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\User;

class OrderLineRepository extends AbstractRepository implements LimitedAccessSubQueryInterface
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

        if (in_array($user->getRole(), [User::ROLE_RESPONSIBLE, User::ROLE_ADMINISTRATOR], true)) {
            return $this->getAllIdsQuery();
        }

        return 'SELECT order_line.id FROM order_line
              JOIN account ON order_line.debit_id = account.id OR order_line.credit_id = account.id 
              WHERE account.owner_id = ' . $user->getId();
    }
}
