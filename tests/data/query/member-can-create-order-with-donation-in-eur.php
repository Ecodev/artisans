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
                        'isCHF' => false,
                        'type' => ProductTypeType::DIGITAL,
                        'pricePerUnit' => '10.12',
                    ],
                ],
            ],
        ],
    ],
    [
        'data' => [
            'createOrder' => [
                'paymentMethod' => 'bvr',
                'balanceCHF' => '0.00',
                'balanceEUR' => '10.12',
                'orderLines' => [
                    [
                        'quantity' => 1,
                        'type' => 'digital',
                        'balanceCHF' => '0.00',
                        'balanceEUR' => '10.12',
                    ],
                ],
            ],
        ],
    ],
];
