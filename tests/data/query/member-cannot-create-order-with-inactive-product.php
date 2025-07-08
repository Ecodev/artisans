<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation ($input: OrderInput!) {
            createOrder(input: $input) {
                id
            }
        }',
        'variables' => [
            'input' => [
                'paymentMethod' => Application\Enum\PaymentMethod::Bvr,
                'orderLines' => [
                    [
                        'product' => 3010,
                        'quantity' => 250,
                        'isCHF' => true,
                        'type' => Application\Enum\ProductType::Digital,
                    ],
                ],
            ],
        ],
    ],
    [
        'errors' => [
            [
                'message' => 'Entity not found for class `Application\Model\Product` and ID `3010`.',
                'extensions' => [
                    'objectNotFound' => true,
                ],
                'locations' => [
                    [
                        'line' => 2,
                        'column' => 13,
                    ],
                ],
                'path' => [
                    'createOrder',
                ],
            ],
        ],
        'data' => [
            'createOrder' => null,
        ],

    ],
];
