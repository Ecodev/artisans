<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Utility;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Api\Scalar\CHFType;
use Ecodev\Felix\Api\Scalar\EURType;
use GraphQL\Doctrine\Attribute as API;
use Money\Money;

trait HasBalance
{
    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    private bool $isCHF = true;

    #[ORM\Column(type: 'CHF')]
    private Money $balanceCHF;

    #[ORM\Column(type: 'EUR')]
    private Money $balanceEUR;

    /**
     * Set balance.
     */
    #[API\Input(type: CHFType::class)]
    public function setBalanceCHF(Money $balanceCHF): void
    {
        $this->balanceCHF = $balanceCHF;
    }

    #[API\Field(type: CHFType::class)]
    public function getBalanceCHF(): Money
    {
        return $this->balanceCHF;
    }

    /**
     * Set balance.
     */
    #[API\Input(type: EURType::class)]
    public function setBalanceEUR(Money $balanceEUR): void
    {
        $this->balanceEUR = $balanceEUR;
    }

    #[API\Field(type: EURType::class)]
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
