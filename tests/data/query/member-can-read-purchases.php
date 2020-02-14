<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            purchases {
                items {
                        id
                    product {
                        id
                    }
                }
            }
        }',
    ],
    [
        'data' => [
            'purchases' => [
                'items' => [
                    [
                        'id' => 17001,
                        'product' => [
                            'id' => 3002,
                        ],
                    ],
                    [
                        'id' => 17000,
                        'product' => [
                            'id' => 3000,
                        ],
                    ],
                ],
            ],
        ],
    ],
];
