<?php

declare(strict_types=1);

namespace Application;

use Application\Traits\HasBalanceInterface;
use Ecodev\Felix\Format;

abstract class Utility
{
    public static function sanitizeRichText(string $string): string
    {
        $sanitized = strip_tags($string, ['ul', 'ol', 'li', 'p', 'br', 'sup', 'sub', 'a', 'strong', 'em']);

        return $sanitized;
    }

    public static function getFormattedBalance(HasBalanceInterface $hasBalance): string
    {
        $money = $hasBalance->getBalanceEUR()->isZero() ? $hasBalance->getBalanceCHF() : $hasBalance->getBalanceEUR();

        return Format::money($money) . ' ' . $money->getCurrency()->getCode();
    }
}
