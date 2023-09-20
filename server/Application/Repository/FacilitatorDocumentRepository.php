<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\FacilitatorDocument;
use Application\Model\User;

use Ecodev\Felix\Repository\LimitedAccessSubQuery;

/**
 * @extends AbstractRepository<FacilitatorDocument>
 */
class FacilitatorDocumentRepository extends AbstractRepository implements LimitedAccessSubQuery
{
    /**
     * Returns pure SQL to get ID of all objects that are accessible to given user.
     *
     * A user can access a file if at least one of the following condition is true:
     *
     * - he is facilitator or administrator
     *
     * @param null|User $user
     */
    public function getAccessibleSubQuery(?\Ecodev\Felix\Model\User $user): string
    {
        if ($user && in_array($user->getRole(), [User::ROLE_FACILITATOR, User::ROLE_ADMINISTRATOR], true)) {
            return '';
        }

        return 'SELECT id FROM facilitator_document WHERE facilitator_document.is_active';
    }
}
