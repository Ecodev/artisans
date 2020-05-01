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
                'totalPricePerUnitCHF' => '75.00',
                'totalPricePerUnitEUR' => '66.50',
            ],
        ],
    ],
];
