<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Utility;

use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Attribute as API;
use Money\Money;

trait HasBalance
{
    /**
     * @var bool
     */
    #[ORM\Column(type: 'boolean', options: ['default' => 1])]
    private $isCHF = true;

    /**
     * @var Money
     */
    #[ORM\Column(type: 'CHF')]
    private $balanceCHF;

    /**
     * @var Money
     */
    #[ORM\Column(type: 'EUR')]
    private $balanceEUR;

    /**
     * Set balance.
     */
    #[API\Input(type: 'CHF')]
    public function setBalanceCHF(Money $balanceCHF): void
    {
        $this->balanceCHF = $balanceCHF;
    }

    #[API\Field(type: 'CHF')]
    public function getBalanceCHF(): Money
    {
        return $this->balanceCHF;
    }

    /**
     * Set balance.
     */
    #[API\Input(type: 'EUR')]
    public function setBalanceEUR(Money $balanceEUR): void
    {
        $this->balanceEUR = $balanceEUR;
    }

    #[API\Field(type: 'EUR')]
    public function getBalanceEUR(): Money
    {
        return $this->balanceEUR;
    }

    public function isCHF(): bool
    {
        return $this->isCHF;
    }

    public function setIsCHF(bool $isCHF): void
    {
        $this->isCHF = $isCHF;
    }

    /**
     * Returns the non-zero balance formatted as string.
     */
    public function getFormattedBalance(): string
    {
        return Utility::getFormattedBalance($this);
    }
}
