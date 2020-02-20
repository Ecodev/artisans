<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            products {
                totalPricePerUnitCHF
                totalPricePerUnitEUR
            }
        }',
    ],
    [
        'data' => [
            'products' => [
                'totalPricePerUnitCHF' => '85.00',
                'totalPricePerUnitEUR' => '75.50',
            ],
        ],
    ],
];
