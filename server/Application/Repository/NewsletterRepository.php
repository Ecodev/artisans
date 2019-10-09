<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\User;

class NewsletterRepository extends AbstractRepository implements LimitedAccessSubQueryInterface
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
        if (!$user || $user->getRole() !== User::ROLE_ADMINISTRATOR) {
            return '-1';
        }

        return $this->getAllIdsQuery();
    }
}
