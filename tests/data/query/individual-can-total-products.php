<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            products {
                totalSupplierPrice
                totalPricePerUnit
            }
        }',
    ],
    [
        'data' => [
            'products' => [
                'totalSupplierPrice' => '12.50',
                'totalPricePerUnit' => '24.40',
            ],
        ],
    ],
];
