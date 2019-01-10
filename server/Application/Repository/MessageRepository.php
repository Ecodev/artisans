<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\User;

class MessageRepository extends AbstractRepository implements LimitedAccessSubQueryInterface
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
        if ($user) {
            return 'SELECT id FROM message WHERE recipient_id = ' . $user->getId();
        }

        return '-1';
    }
}
