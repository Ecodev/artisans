<?php

declare(strict_types=1);

namespace Application\Traits;

use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Attribute as API;

trait HasQuantity
{
    /**
     * @var int
     */
    #[ORM\Column(type: 'smallint', options: ['unsigned' => true, 'default' => 0])]
    private $quantity = 0;

    /**
     * Quantity ordered.
     */
    public function getQuantity(): int
    {
        return $this->quantity;
    }

    /**
     * Quantity ordered.
     */
    #[API\Exclude]
    public function setQuantity(int $quantity): void
    {
        $this->quantity = $quantity;
    }
}
