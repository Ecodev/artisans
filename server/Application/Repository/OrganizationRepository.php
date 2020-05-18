<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Organization;
use Application\Model\Product;
use Doctrine\ORM\Query\ResultSetMappingBuilder;

class OrganizationRepository extends AbstractRepository
{
    /**
     * Get the organization that is matching with the most recent review available
     */
    public function getBestMatchingOrganization(string $email): ?Organization
    {
        $rsm = new ResultSetMappingBuilder($this->getEntityManager());
        $rsm->addRootEntityFromClassMetadata(Organization::class, 'organization');
        $rsm->addJoinedEntityFromClassMetadata(Product::class, 'product', 'organization', 'subscriptionLastReview', [], ResultSetMappingBuilder::COLUMN_RENAMING_INCREMENT);

        $sql = 'SELECT ' . $rsm->generateSelectClause() . ' FROM organization
INNER JOIN product ON product.id = organization.subscription_last_review_id
WHERE :email REGEXP pattern
ORDER BY product.review_number DESC
LIMIT 1';

        $query = $this->getEntityManager()->createNativeQuery($sql, $rsm);
        $query->setParameters([
            'email' => $email,
        ]);
        $result = $query->getOneOrNullResult();

        return $result;
    }
}
