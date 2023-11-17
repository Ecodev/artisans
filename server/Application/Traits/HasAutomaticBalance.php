<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Utility;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Api\Scalar\CHFType;
use Ecodev\Felix\Api\Scalar\EURType;
use GraphQL\Doctrine\Attribute as API;
use Money\Money;

trait HasAutomaticBalance
{
    #[ORM\Column(type: 'CHF', options: ['default' => 0])]
    private Money $balanceCHF;

    #[ORM\Column(type: 'EUR', options: ['default' => 0])]
    private Money $balanceEUR;

    /**
     * Get total balance.
     *
     * Read only, computed by SQL triggers
     */
    #[API\Field(type: CHFType::class)]
    public function getBalanceCHF(): Money
    {
        return $this->balanceCHF;
    }

    /**
     * Get total balance.
     *
     * Read only, computed by SQL triggers
     */
    #[API\Field(type: EURType::class)]
    public function getBalanceEUR(): Money
    {
        return $this->balanceEUR;
    }

    /**
     * Returns the non-zero balance formatted as string.
     */
    public function getFormattedBalance(): string
    {
        return Utility::getFormattedBalance($this);
    }
}
