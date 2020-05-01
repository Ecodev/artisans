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
                'totalPricePerUnitCHF' => '80.00',
                'totalPricePerUnitEUR' => '71.00',
            ],
        ],
    ],
];
