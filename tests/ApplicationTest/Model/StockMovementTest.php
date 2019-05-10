<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Product;
use Application\Model\StockMovement;
use PHPUnit\Framework\TestCase;

class StockMovementTest extends TestCase
{
    public function testQuantity(): void
    {
        $stockMovement1 = new StockMovement();
        $product = new Product();

        self::assertSame('0', $product->getQuantity());
        self::assertSame('0', $stockMovement1->getQuantity());
        self::assertSame('0', $stockMovement1->getDelta());

        $stockMovement1->setProduct($product);

        self::assertSame('0.000', $product->getQuantity());
        self::assertSame('0.000', $stockMovement1->getQuantity());
        self::assertSame('0', $stockMovement1->getDelta());

        $stockMovement1->setDelta('10');

        self::assertSame('10.000', $product->getQuantity());
        self::assertSame('10.000', $stockMovement1->getQuantity());
        self::assertSame('10', $stockMovement1->getDelta());

        $stockMovement1->setDelta('-2');

        self::assertSame('-2.000', $product->getQuantity());
        self::assertSame('-2.000', $stockMovement1->getQuantity());
        self::assertSame('-2', $stockMovement1->getDelta());

        $stockMovement2 = new StockMovement();
        $stockMovement2->setProduct($product);
        $stockMovement2->setDelta('20');

        self::assertSame('18.000', $product->getQuantity());
        self::assertSame('-2.000', $stockMovement1->getQuantity());
        self::assertSame('-2', $stockMovement1->getDelta());
        self::assertSame('18.000', $stockMovement2->getQuantity());
        self::assertSame('20', $stockMovement2->getDelta());
    }

    public function testQuantitySetProductAfter(): void
    {
        $stockMovement1 = new StockMovement();
        $product = new Product();

        self::assertSame('0', $product->getQuantity());
        self::assertSame('0', $stockMovement1->getQuantity());
        self::assertSame('0', $stockMovement1->getDelta());

        $stockMovement1->setDelta('10');

        self::assertSame('0', $product->getQuantity());
        self::assertSame('0', $stockMovement1->getQuantity());
        self::assertSame('10', $stockMovement1->getDelta());

        $stockMovement1->setProduct($product);

        self::assertSame('10.000', $product->getQuantity());
        self::assertSame('10.000', $stockMovement1->getQuantity());
        self::assertSame('10', $stockMovement1->getDelta());

        $stockMovement1->setDelta('-2');

        self::assertSame('-2.000', $product->getQuantity());
        self::assertSame('-2.000', $stockMovement1->getQuantity());
        self::assertSame('-2', $stockMovement1->getDelta());

        $stockMovement2 = new StockMovement();
        $stockMovement2->setDelta('20');
        $stockMovement2->setProduct($product);

        self::assertSame('18.000', $product->getQuantity());
        self::assertSame('-2.000', $stockMovement1->getQuantity());
        self::assertSame('-2', $stockMovement1->getDelta());
        self::assertSame('18.000', $stockMovement2->getQuantity());
        self::assertSame('20', $stockMovement2->getDelta());
    }
}
