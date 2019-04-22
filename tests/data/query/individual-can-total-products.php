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
                'totalSupplierPrice' => '33347.00',
                'totalPricePerUnit' => '68.85',
            ],
        ],
    ],
];
