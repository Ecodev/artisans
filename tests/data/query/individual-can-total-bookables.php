<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            bookables {
                totalPurchasePrice
                totalInitialPrice
                totalPeriodicPrice
            }
        }',
    ],
    [
        'data' => [
            'bookables' => [
                'totalPurchasePrice' => '33347.00',
                'totalInitialPrice' => '10.00',
                'totalPeriodicPrice' => '180.00',
            ],
        ],
    ],
];
