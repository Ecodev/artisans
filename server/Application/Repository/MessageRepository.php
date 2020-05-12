<?php

declare(strict_types=1);

namespace Application\Repository;

use Ecodev\Felix\Model\User;
use Ecodev\Felix\Repository\LimitedAccessSubQuery;

class MessageRepository extends AbstractRepository implements LimitedAccessSubQuery, \Ecodev\Felix\Repository\MessageRepository
{
    use \Ecodev\Felix\Repository\Traits\MessageRepository;

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

        return 'SELECT id FROM message WHERE recipient_id = ' . $user->getId();
    }
}
