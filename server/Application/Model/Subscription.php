<?php

declare(strict_types=1);

namespace Application\Model;

use Doctrine\ORM\Mapping as ORM;

/**
 * A subscription
 *
 * @ORM\Entity(repositoryClass="\Application\Repository\SubscriptionRepository")
 */
class Subscription extends AbstractProduct
{
}
