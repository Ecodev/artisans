<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\News;
use Application\Model\User;

use Ecodev\Felix\Repository\LimitedAccessSubQuery;

/**
 * @extends AbstractRepository<News>
 */
class NewsRepository extends AbstractRepository implements LimitedAccessSubQuery
{
    /**
     * Returns pure SQL to get ID of all objects that are accessible to given user.
     *
     * A user can access a news if at least one of the following conditions is true:
     *
     * - he is administrator
     * - the news is active
     *
     * @param null|User $user
     */
    public function getAccessibleSubQuery(?\Ecodev\Felix\Model\User $user): string
    {
        if ($user && $user->getRole() === User::ROLE_ADMINISTRATOR) {
            return '';
        }

        return 'SELECT id FROM news WHERE is_active';
    }

    public function getIds(): array
    {
        $query = $this->createQueryBuilder('news')
            ->select('news.id')
            ->where('news.date < CURRENT_TIMESTAMP()')
            ->andWhere('news.isActive = true')
            ->orderBy('news.id')
            ->getQuery();

        $result = $query->getArrayResult();

        return $result;
    }
}
