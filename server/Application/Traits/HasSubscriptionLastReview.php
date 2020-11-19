<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Model\Product;
use Doctrine\ORM\Mapping as ORM;
use InvalidArgumentException;

trait HasSubscriptionLastReview
{
    /**
     * @var null|Product
     *
     * @ORM\ManyToOne(targetEntity="Product")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=true, onDelete="SET NULL")
     * })
     */
    private $subscriptionLastReview;

    /**
     * Get last review available through a subscription
     */
    public function getSubscriptionLastReview(): ?Product
    {
        return $this->subscriptionLastReview;
    }

    /**
     * Set last review available through a subscription
     *
     * @API\Exclude
     */
    public function setSubscriptionLastReview(?Product $subscriptionLastReview): void
    {
        if ($subscriptionLastReview && !$subscriptionLastReview->getReviewNumber()) {
            throw new InvalidArgumentException('The last review of a subscription must be a review, not an article');
        }

        $this->subscriptionLastReview = $subscriptionLastReview;
    }
}
