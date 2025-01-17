<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation ($input: OrderInput!) {
            createOrder(input: $input) {
                paymentMethod
                balanceCHF
                balanceEUR
                orderLines {
                    quantity
                    type
                    balanceCHF
                    balanceEUR
                }
            }
        }',
        'variables' => [
            'input' => [
                'paymentMethod' => Application\Enum\PaymentMethod::Bvr,
                'orderLines' => [
                    [
                        'quantity' => 1,
                        'isCHF' => true,
                        'type' => Application\Enum\ProductType::Digital,
                        'pricePerUnit' => '-10',
                    ],
                ],
            ],
        ],
    ],
    [
        'errors' => [
            [
                'message' => 'A donation must have strictly positive price',
                'extensions' => [
                    'showSnack' => true,
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
