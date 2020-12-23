<?php

declare(strict_types=1);

namespace Application\Traits;

use Money\Money;

interface HasBalanceInterface
{
    public function getBalanceCHF(): Money;

    public function getBalanceEUR(): Money;

    public function getFormattedBalance(): string;
}
