<?php

declare(strict_types=1);

namespace Application\Traits;

trait HasAutomaticQuantity
{
    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=10, scale=3, options={"default" = "0.00"})
     */
    private $quantity = '0';

    /**
     * Quantity in stock
     *
     * Read-only, automatically computed by StockMovementUpdater
     *
     * @return string
     */
    public function getQuantity(): string
    {
        return $this->quantity;
    }
}
