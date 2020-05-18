<?php

declare(strict_types=1);

namespace Application\Traits;

use GraphQL\Doctrine\Annotation as API;

trait HasQuantity
{
    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=10, scale=3, options={"default" = "0.00"})
     */
    private $quantity = '0';

    /**
     * Quantity currently in stock
     */
    public function getQuantity(): string
    {
        return $this->quantity;
    }

    /**
     * Quantity currently in stock
     *
     * @API\Exclude
     */
    public function setQuantity(string $quantity): void
    {
        $this->quantity = $quantity;
    }
}
