<?php

declare(strict_types=1);

use Application\DBAL\Types\PaymentMethodType;
use Application\DBAL\Types\ProductTypeType;

return [
    [
        'query' => 'mutation ($input: OrderInput!) {
            createOrder(input: $input) {
                id
            }
        }',
        'variables' => [
            'input' => [
                'paymentMethod' => PaymentMethodType::BVR,
                'orderLines' => [
                    [
                        'product' => 3010,
                        'quantity' => 250,
                        'isCHF' => true,
                        'type' => ProductTypeType::DIGITAL,
                    ],
                ],
            ],
        ],
    ],
    [
        'errors' => [
            [
                'message' => 'Entity not found for class `Application\\Model\\Product` and ID `3010`.',
                'extensions' => [
                    'category' => 'graphql',
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
