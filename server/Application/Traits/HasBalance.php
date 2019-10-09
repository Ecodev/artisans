<?php

declare(strict_types=1);

namespace Application\Traits;

use GraphQL\Doctrine\Annotation as API;
use Money\Money;

trait HasBalance
{
    /**
     * @var bool
     *
     * @ORM\Column(type="boolean", options={"default" = 1})
     */
    private $isCHF = true;

    /**
     * @var Money
     *
     * @ORM\Column(type="CHF")
     */
    private $balanceCHF;

    /**
     * @var Money
     *
     * @ORM\Column(type="EUR")
     */
    private $balanceEUR;

    /**
     * Set balance
     *
     * @API\Input(type="CHF")
     *
     * @param Money $balanceCHF
     */
    public function setBalanceCHF(Money $balanceCHF): void
    {
        $this->balanceCHF = $balanceCHF;
    }

    /**
     * @API\Field(type="CHF")
     *
     * @return Money
     */
    public function getBalanceCHF(): Money
    {
        return $this->balanceCHF;
    }

    /**
     * Set balance
     *
     * @API\Input(type="EUR")
     *
     * @param Money $balanceEUR
     */
    public function setBalanceEUR(Money $balanceEUR): void
    {
        $this->balanceEUR = $balanceEUR;
    }

    /**
     * @API\Field(type="EUR")
     *
     * @return Money
     */
    public function getBalanceEUR(): Money
    {
        return $this->balanceEUR;
    }

    /**
     * @return bool
     */
    public function isCHF(): bool
    {
        return $this->isCHF;
    }

    /**
     * @param bool $isCHF
     */
    public function setIsCHF(bool $isCHF): void
    {
        $this->isCHF = $isCHF;
    }
}
