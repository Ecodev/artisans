<?php

declare(strict_types=1);

namespace Application\Traits;

use Money\Money;

trait HasAutomaticBalance
{
    /**
     * @var Money
     *
     * @ORM\Column(type="Money", options={"default" = 0})
     */
    private $balance;

    /**
     * Get total balance
     *
     * Read only, computed by SQL triggers
     *
     * @return Money
     */
    public function getBalance(): Money
    {
        return $this->balance;
    }
}
