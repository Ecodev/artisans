#! /usr/bin/env php
<?php

use Application\DBAL\Types\StockMovementTypeType;
use Application\Model\Product;
use Application\Model\StockMovement;

require_once 'server/cli.php';

/**
 * This inject stock movements for things that happened before stock
 * management was even a thing. This should be a one-shot use.
 */
function fixStockMovements(): void
{
    $products = _em()->getConnection()->fetchAll('SELECT product.id, product.quantity, IFNULL(SUM(stock_movement.delta), 0) AS sum
FROM product
    LEFT JOIN stock_movement ON stock_movement.product_id = product.id
GROUP BY product.id, product.quantity
HAVING sum != product.quantity
ORDER BY product.id');

    foreach ($products as $p) {
        $s = new StockMovement();
        $s->setType(StockMovementTypeType::INVENTORY);
        $s->setDelta($p['quantity'] - $p['sum']);
        $s->setProduct(_em()->getReference(Product::class, (int) $p['id']));
        $s->setRemarks('Correction automatique pour compléter l\'historique manquant avant l\'introduction de la gestion de stock');

        _em()->persist($s);
    }

    _em()->flush();

    echo count($products) . ' stockMovements created to fix historical data' . PHP_EOL;
}

fixStockMovements();
