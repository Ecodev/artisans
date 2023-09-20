<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\DBAL\Types\ProductTypeType;
use Application\Model\File;
use Application\Model\Order;
use Application\Model\User;

use Ecodev\Felix\Repository\LimitedAccessSubQuery;
use Ecodev\Felix\Utility;

/**
 * @extends AbstractRepository<File>
 */
class FileRepository extends AbstractRepository implements LimitedAccessSubQuery
{
    /**
     * Returns pure SQL to get ID of all objects that are accessible to given user.
     *
     * A user can access a file if at least one of the following condition is true:
     *
     * - he has flag webTemporaryAccess
     * - he has web subscription (digital/both) and the product reviewNumber is included in that subscription
     * - he bought the product
     * - the product is free and active
     *
     * @param null|User $user
     */
    public function getAccessibleSubQuery(?\Ecodev\Felix\Model\User $user): string
    {
        if ($user && in_array($user->getRole(), [User::ROLE_FACILITATOR, User::ROLE_ADMINISTRATOR], true)) {
            return '';
        }

        $queries = [];

        $connection = $this->getEntityManager()->getConnection();
        $subscriptionLastReviewNumber = $user ? $user->getSubscriptionLastReviewNumber() : null;
        $hasSubscription = $user && ProductTypeType::includesDigital($user->getSubscriptionType()) && $subscriptionLastReviewNumber;
        $digitalTypes = Utility::quoteArray(ProductTypeType::getDigitalTypes());

        if ($user && $user->getWebTemporaryAccess()) {
            // Files for webTemporaryAccess
            $queries[] = '
SELECT product.file_id FROM product
WHERE
product.is_active
AND product.file_id IS NOT NULL
AND product.type IN (' . $digitalTypes . ')';
        } elseif ($hasSubscription) {
            $allowedReviewNumber = $connection->quote($subscriptionLastReviewNumber);

            // Files for web subscription
            $queries[] = '
SELECT product.file_id FROM product
LEFT JOIN product AS review ON product.review_id = review.id
WHERE
product.is_active
AND product.file_id IS NOT NULL
AND product.type IN (' . $digitalTypes . ')
AND (product.review_number <= ' . $allowedReviewNumber . ' OR review.review_number <= ' . $allowedReviewNumber . ')';
        }

        if ($user) {
            // Files for products that were bought directly
            $queries[] = '
SELECT product.file_id FROM product
INNER JOIN order_line ON product.id = order_line.product_id
INNER JOIN `order` ON order_line.order_id = `order`.id
AND `order`.status = ' . $connection->quote(Order::STATUS_VALIDATED) . '
AND `order`.owner_id =  ' . $user->getId() . '
WHERE
product.is_active
AND product.file_id IS NOT NULL
';
        }

        // Free product are accessible to everybody
        $queries[] = '
SELECT product.file_id FROM product
WHERE
product.is_active
AND product.file_id IS NOT NULL
AND product.price_per_unit_chf = 0
AND product.price_per_unit_eur = 0';

        return implode(' UNION ', $queries);
    }
}
