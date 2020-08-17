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
                        'product' => 3000,
                        'quantity' => 250,
                        'isCHF' => true,
                        'type' => ProductTypeType::DIGITAL,
                    ],
                    [
                        'product' => 3001,
                        'quantity' => 1,
                        'isCHF' => true,
                        'type' => ProductTypeType::PAPER,
                    ],
                ],
            ],
        ],
    ],
    [
        'data' => [
            'createOrder' => [
                'paymentMethod' => PaymentMethodType::BVR,
                'balanceCHF' => '3765.00',
                'balanceEUR' => '0.00',
                'orderLines' => [
                    [
                        'quantity' => 250,
                        'type' => ProductTypeType::DIGITAL,
                        'balanceCHF' => '3750.00',
                        'balanceEUR' => '0.00',
                    ],
                    [
                        'quantity' => 1,
                        'type' => ProductTypeType::PAPER,
                        'balanceCHF' => '15.00',
                        'balanceEUR' => '0.00',
                    ],
                ],
            ],
        ],

    ],
];
