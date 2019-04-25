<?php

declare(strict_types=1);

namespace Application\Traits;

trait HasQuantity
{
    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=10, scale=2, options={"default" = "0.00"})
     */
    private $quantity = '0';

    /**
     * Quantity currently in stock
     *
     * @return string
     */
    public function getQuantity(): string
    {
        return $this->quantity;
    }

    /**
     * Quantity currently in stock
     *
     * @param string $quantity
     */
    public function setQuantity(string $quantity): void
    {
        $this->quantity = $quantity;
    }
}
