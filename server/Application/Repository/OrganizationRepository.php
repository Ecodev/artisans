<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\DBAL\Types\ProductTypeType;

class OrganizationRepository extends AbstractRepository
{
    /**
     * Apply the organizations accesses to all users
     *
     * - If a user email matches the org pattern and the org access is better, then user will get the org access
     * - If many organizations match then only the best one is used
     */
    public function applyOrganizationAccesses(): void
    {
        $connection = $this->getEntityManager()->getConnection();

        $sqlUpgrade = <<<STRING
                UPDATE user
                INNER JOIN (
                    SELECT user.email, MAX(product.review_number) AS bestReviewNumber
                    FROM organization
                    INNER JOIN product ON organization.subscription_last_review_id = product.id
                    INNER JOIN user ON user.email REGEXP organization.pattern
                    GROUP BY user.email
                ) AS bestMatch ON user.email = bestMatch.email
                INNER JOIN product AS orgProduct ON orgProduct.review_number = bestMatch.bestReviewNumber
                LEFT JOIN product AS userProduct ON userProduct.id = user.subscription_last_review_id
                SET
                    user.subscription_last_review_id = IF(userProduct.id IS NULL OR orgProduct.review_number > userProduct.review_number, orgProduct.id, userProduct.id),
                    user.subscription_type = IF(user.subscription_type IN (:paper, :both), :both, :digital)
            STRING;

        $params = [
            'paper' => ProductTypeType::PAPER,
            'both' => ProductTypeType::BOTH,
            'digital' => ProductTypeType::DIGITAL,
        ];

        $connection->executeUpdate($sqlUpgrade, $params);
    }
}
