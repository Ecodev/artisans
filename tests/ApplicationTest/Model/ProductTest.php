<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Product;
use PHPUnit\Framework\TestCase;

class ProductTest extends TestCase
{
    public function testRelatedProducts(): void
    {
        $product1 = new Product();
        $product2 = new Product();

        self::assertCount(0, $product1->getRelatedProducts());
        self::assertCount(0, $product2->getRelatedProducts());

        $product1->addRelatedProduct($product2);

        self::assertCount(1, $product1->getRelatedProducts());
        self::assertCount(1, $product2->getRelatedProducts());

        self::assertSame($product2, $product1->getRelatedProducts()->first());
        self::assertSame($product1, $product2->getRelatedProducts()->first());

        $product2->removeRelatedProduct($product1);

        self::assertCount(0, $product1->getRelatedProducts());
        self::assertCount(0, $product2->getRelatedProducts());
    }

    public function testRelatedProductWithSelf(): void
    {
        $this->expectExceptionMessage('A product cannot be related to itself');
        $product = new Product();
        $product->addRelatedProduct($product);
    }
}
