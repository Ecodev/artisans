<?php

declare(strict_types=1);

namespace Application\Traits;

use GraphQL\Doctrine\Annotation as API;
use Money\Money;

trait HasAutomaticBalance
{
    /**
     * @var Money
     *
     * @ORM\Column(type="CHF", options={"default" = 0})
     */
    private $balanceCHF;

    /**
     * @var Money
     *
     * @ORM\Column(type="EUR", options={"default" = 0})
     */
    private $balanceEUR;

    /**
     * Get total balance
     *
     * Read only, computed by SQL triggers
     *
     * @API\Field(type="CHF")
     *
     * @return Money
     */
    public function getBalanceCHF(): Money
    {
        return $this->balanceCHF;
    }

    /**
     * Get total balance
     *
     * Read only, computed by SQL triggers
     *
     * @API\Field(type="EUR")
     *
     * @return Money
     */
    public function getBalanceEUR(): Money
    {
        return $this->balanceEUR;
    }
}
