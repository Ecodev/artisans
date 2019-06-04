<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\StockMovement;
use PHPUnit\Framework\TestCase;

class StockMovementTest extends TestCase
{
    public function testDefaultValues(): void
    {
        $s = new StockMovement();
        self::assertSame('0', $s->getQuantity());
    }
}
