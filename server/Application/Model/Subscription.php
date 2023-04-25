<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\SubscriptionRepository;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Attribute as API;

/**
 * A subscription.
 */
#[ORM\Entity(SubscriptionRepository::class)]
class Subscription extends AbstractProduct
{
    #[API\Exclude]
    public function isPro(): bool
    {
        return (bool) preg_match('~^abo-pro-~', (string) $this->getCode());
    }
}
