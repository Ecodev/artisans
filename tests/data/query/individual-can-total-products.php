<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            products {
                totalPurchasePrice
                totalInitialPrice
                totalPeriodicPrice
            }
        }',
    ],
    [
        'data' => [
            'products' => [
                'totalPurchasePrice' => '33347.00',
                'totalInitialPrice' => '10.00',
                'totalPeriodicPrice' => '180.00',
            ],
        ],
    ],
];
