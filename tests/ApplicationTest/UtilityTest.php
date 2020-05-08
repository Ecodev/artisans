<?php

declare(strict_types=1);

namespace ApplicationTest;

class UtilityTest extends \PHPUnit\Framework\TestCase
{
    public function testSanitizeRichText(): void
    {
        self::assertSame('foo<p>bar<p/>', \Application\Utility::sanitizeRichText('<div>foo</div><p>bar<p/>'));
    }
}
