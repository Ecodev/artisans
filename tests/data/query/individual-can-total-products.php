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
                'totalSupplierPrice' => '71.40',
                'totalPricePerUnit' => '89.10',
            ],
        ],
    ],
];
