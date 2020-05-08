<?php

declare(strict_types=1);

namespace Application;

abstract class Utility
{
    public static function sanitizeRichText(string $string): string
    {
        $sanitized = strip_tags($string, ['ul', 'ol', 'li', 'p', 'br', 'sup', 'sub', 'a', 'strong', 'em']);

        return $sanitized;
    }
}
