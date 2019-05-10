<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation ($inputStockMovement: StockMovementInput!, $product: ProductID!) {
            createStockMovement(input: $inputStockMovement, product: $product) {
                delta
                quantity
                product {
                    quantity
                }
            }
        }',
        'variables' => [
            'inputStockMovement' => [
                'type' => 'delivery',
                'delta' => 5,
            ],

            'product' => 3000,
        ],
    ],
    [
        'data' => [
            'createStockMovement' => [
                'delta' => '5',
                'quantity' => '13.000',
                'product' => [
                    'quantity' => '13.000',
                ],
            ],
        ],
    ],
];
