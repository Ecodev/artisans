<?php

declare(strict_types=1);

namespace Application\Traits;

use Money\Money;

trait HasUnsignedBalance
{
    /**
     * @var Money
     *
     * @ORM\Column(type="Money", options={"unsigned" = true})
     */
    private $balance;

    /**
     * Set balance
     *
     * @param Money $balance
     */
    public function setBalance(Money $balance): void
    {
        $this->balance = $balance;
    }

    /**
     * @return Money
     */
    public function getBalance(): Money
    {
        return $this->balance;
    }
}
