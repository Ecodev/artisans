<?php

declare(strict_types=1);

namespace Application\Traits;

trait HasBalance
{
    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=10, scale=2, options={"unsigned" = true})
     */
    private $balance;

    /**
     * Set balance
     *
     * @param string $balance
     */
    public function setBalance(string $balance): void
    {
        $this->balance = $balance;
    }

    /**
     * @return string
     */
    public function getBalance(): string
    {
        return $this->balance;
    }
}
