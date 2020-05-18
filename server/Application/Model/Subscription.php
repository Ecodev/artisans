<?php

declare(strict_types=1);

namespace Application\Model;

use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * A subscription
 *
 * @ORM\Entity(repositoryClass="\Application\Repository\SubscriptionRepository")
 */
class Subscription extends AbstractProduct
{
    /**
     * @API\Exclude
     */
    public function isPro(): bool
    {
        return (bool) preg_match('~^abo-pro-~', $this->getCode());
    }
}
