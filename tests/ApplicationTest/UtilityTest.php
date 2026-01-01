<?php

declare(strict_types=1);

namespace ApplicationTest;

use Application\Utility;
use PHPUnit\Framework\TestCase;

class UtilityTest extends TestCase
{
    public function testSanitizeRichText(): void
    {
        self::assertSame('foo<p>bar<p/>', Utility::sanitizeRichText('<div>foo</div><p>bar<p/>'));
    }
}
