<?php

declare(strict_types=1);

use Application\DBAL\Types\PaymentMethodType;
use Application\DBAL\Types\ProductTypeType;

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
                'paymentMethod' => PaymentMethodType::BVR,
                'orderLines' => [
                    [
                        'quantity' => 1,
                        'isCHF' => true,
                        'type' => ProductTypeType::DIGITAL,
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
