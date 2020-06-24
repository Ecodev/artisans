<?php

declare(strict_types=1);

namespace Application;

use Application\Model\Order;
use Money\Currencies\ISOCurrencies;
use Money\Formatter\DecimalMoneyFormatter;

abstract class Utility
{
    public static function sanitizeRichText(string $string): string
    {
        $sanitized = strip_tags($string, ['ul', 'ol', 'li', 'p', 'br', 'sup', 'sub', 'a', 'strong', 'em']);

        return $sanitized;
    }

    public static function getFormattedBalance($object): string
    {
        $money = $object->getBalanceEUR()->isZero() ? $object->getBalanceCHF() : $object->getBalanceEUR();
        $currencies = new ISOCurrencies();
        $moneyFormatter = new DecimalMoneyFormatter($currencies);

        return $moneyFormatter->format($money) . ' ' . $money->getCurrency()->getCode();
    }
}
