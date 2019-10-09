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
                'totalPricePerUnitCHF' => '25.00',
                'totalPricePerUnitEUR' => '35.50',
            ],
        ],
    ],
];
