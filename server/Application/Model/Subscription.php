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
    /**
     * @var string
     *
     * @ORM\Column(type="SubscriptionType")
     */
    private $type;

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * @param string $type
     */
    public function setType(string $type): void
    {
        $this->type = $type;
    }
}
