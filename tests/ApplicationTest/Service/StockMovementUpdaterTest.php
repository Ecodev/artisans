<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\DBAL\Types\PurchaseStatusType;
use Application\DBAL\Types\StockMovementTypeType;
use Application\Model\Product;
use Application\Model\StockMovement;
use Application\Model\User;
use ApplicationTest\Traits\TestWithTransaction;
use PHPUnit\Framework\TestCase;

class StockMovementUpdaterTest extends TestCase
{
    use TestWithTransaction;

    public function testStockMovementAreKeptUpToDate(): void
    {
        /** @var User $user */
        $user = _em()->getRepository(User::class)->getOneByLogin('administrator');
        User::setCurrent($user);

        /** @var Product $product1 */
        $product1 = $this->getEntityManager()->getReference(Product::class, 3005);

        /** @var Product $product2 */
        $product2 = $this->getEntityManager()->getReference(Product::class, 3011);

        $this->assertHistory($product1, [
            [
                'delta' => '20.000',
                'quantity' => '20.000',
            ],
            [
                'delta' => '-0.600',
                'quantity' => '19.400',
            ],
            [
                'delta' => '10.000',
                'quantity' => '29.400',
            ],
            [
                'delta' => '-0.600',
                'quantity' => '28.800',
            ],
            [
                'delta' => '-2.000',
                'quantity' => '26.800',
            ],
        ]);

        $this->assertHistory($product2, [
            [
                'delta' => '8.000',
                'quantity' => '8.000',
            ],
            [
                'delta' => '-1.000',
                'quantity' => '7.000',
            ],
            [
                'delta' => '-2.000',
                'quantity' => '5.000',
            ],
        ]);

        /** @var StockMovement $stockMovement */
        $stockMovement = $this->getEntityManager()->getReference(StockMovement::class, 18016);
        $stockMovement->setDelta('15.000');
        $this->getEntityManager()->flush();

        // After stock movement modification, the whole history must be corrected
        self::assertSame('34.400', $stockMovement->getQuantity());
        $this->assertHistory($product1, [
            [
                'delta' => '20.000',
                'quantity' => '20.000',
            ],
            [
                'delta' => '-0.600',
                'quantity' => '19.400',
            ],
            [
                'delta' => '15.000',
                'quantity' => '34.400',
            ],
            [
                'delta' => '-0.600',
                'quantity' => '33.800',
            ],
            [
                'delta' => '-2.000',
                'quantity' => '31.800',
            ],
        ]);

        // Change stock movement to other product
        $stockMovement->setDelta('10.000');
        $stockMovement->setProduct($product2);
        $this->getEntityManager()->flush();

        // After stock movement modification to another product, both histories must be corrected
        self::assertSame('17.000', $stockMovement->getQuantity());
        $this->assertHistory($product1, [
            [
                'delta' => '20.000',
                'quantity' => '20.000',
            ],
            [
                'delta' => '-0.600',
                'quantity' => '19.400',
            ],
            [
                'delta' => '-0.600',
                'quantity' => '18.800',
            ],
            [
                'delta' => '-2.000',
                'quantity' => '16.800',
            ],
        ]);

        $this->assertHistory($product2, [
            [
                'delta' => '8.000',
                'quantity' => '8.000',
            ],
            [
                'delta' => '-1.000',
                'quantity' => '7.000',
            ],
            [
                'delta' => '10.000',
                'quantity' => '17.000',
            ],
            [
                'delta' => '-2.000',
                'quantity' => '15.000',
            ],
        ]);

        $this->getEntityManager()->remove($stockMovement);
        $this->getEntityManager()->flush();

        $this->assertHistory($product2, [
            [
                'delta' => '8.000',
                'quantity' => '8.000',
            ],
            [
                'delta' => '-1.000',
                'quantity' => '7.000',
            ],
            [
                'delta' => '-2.000',
                'quantity' => '5.000',
            ],
        ]);

        self::assertSame(PurchaseStatusType::TO_ORDER, $product2->getPurchaseStatus());

        $s1 = new StockMovement();
        $s1->setType(StockMovementTypeType::DELIVERY);
        $s1->setProduct($product2);
        $s1->setDelta('20.000');

        $s2 = new StockMovement();
        $s2->setType(StockMovementTypeType::DELIVERY);
        $s2->setProduct($product2);
        $s2->setDelta('40.000');

        $this->getEntityManager()->persist($s1);
        $this->getEntityManager()->persist($s2);
        $this->getEntityManager()->flush();

        self::assertSame('25.000', $s1->getQuantity());
        self::assertSame('65.000', $s2->getQuantity());

        self::assertSame(PurchaseStatusType::OK, $product2->getPurchaseStatus());

        $this->assertHistory($product2, [
            [
                'delta' => '8.000',
                'quantity' => '8.000',
            ],
            [
                'delta' => '-1.000',
                'quantity' => '7.000',
            ],
            [
                'delta' => '-2.000',
                'quantity' => '5.000',
            ],
            [
                'delta' => '20.000',
                'quantity' => '25.000',
            ],
            [
                'delta' => '40.000',
                'quantity' => '65.000',
            ],
        ]);
    }

    public function testFirstStockMovementOfProduct(): void
    {
        /** @var User $user */
        $user = _em()->getRepository(User::class)->getOneByLogin('administrator');
        User::setCurrent($user);

        /** @var Product $product1 */
        $product1 = $this->getEntityManager()->getReference(Product::class, 3003);

        $this->assertHistory($product1, [
        ]);

        $s1 = new StockMovement();
        $s1->setType(StockMovementTypeType::DELIVERY);
        $s1->setProduct($product1);
        $s1->setDelta('20.000');

        $this->getEntityManager()->persist($s1);
        $this->getEntityManager()->flush();

        self::assertSame('20.000', $s1->getQuantity());
        $this->assertHistory($product1, [
            [
                'delta' => '20.000',
                'quantity' => '20.000',
            ],
        ]);
    }

    private function assertHistory(Product $product, array $expected): void
    {
        $connection = $this->getEntityManager()->getConnection();
        $actual = $connection->fetchAll('SELECT delta, quantity FROM stock_movement WHERE product_id = ' . $product->getId() . ' ORDER BY creation_date, id');

        self::assertSame($expected, $actual);

        $actualInMemory = $product->getQuantity();
        $actualInDB = $connection->fetchColumn('SELECT quantity FROM product WHERE id = ' . $product->getId());
        $expectedProductQuantity = end($expected)['quantity'] ?? '0.000';

        self::assertSame($expectedProductQuantity, $actualInDB, 'product quantity in DB must be equal to final stock movement');
        self::assertSame($expectedProductQuantity, $actualInMemory, 'product quantity in memory must have been refreshed');
    }
}
