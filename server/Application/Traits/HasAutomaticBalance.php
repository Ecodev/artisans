<?php

declare(strict_types=1);

namespace Application\Traits;

use GraphQL\Doctrine\Annotation as API;
use Money\Currencies\ISOCurrencies;
use Money\Formatter\DecimalMoneyFormatter;
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

    /**
     * Returns the non-zero balance formatted as string
     *
     * @return string
     */
    public function getFormattedBalance(): string
    {
        $money = $this->getBalanceCHF()->isZero() ? $this->getBalanceEUR() : $this->getBalanceCHF();
        $currencies = new ISOCurrencies();
        $moneyFormatter = new DecimalMoneyFormatter($currencies);

        return $moneyFormatter->format($money) . ' ' . $money->getCurrency()->getCode();
    }
}
