<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\User;
use Ecodev\Felix\Repository\LimitedAccessSubQuery;

class NewsRepository extends AbstractRepository implements LimitedAccessSubQuery
{
    /**
     * Returns pure SQL to get ID of all objects that are accessible to given user.
     *
     * A user can access a news if at least one of the following condition is true:
     *
     * - he is administrator
     * - the news is active
     *
     * @param null|User $user
     *
     * @return string
     */
    public function getAccessibleSubQuery(?\Ecodev\Felix\Model\User $user): string
    {
        if ($user && $user->getRole() === User::ROLE_ADMINISTRATOR) {
            return $this->getAllIdsQuery();
        }

        return 'SELECT id FROM news WHERE is_active';
    }
}
