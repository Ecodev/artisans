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
                'paymentMethod' => 'Bvr',
                'orderLines' => [
                    [
                        'quantity' => 1,
                        'isCHF' => false,
                        'type' => 'Digital',
                        'pricePerUnit' => '10.12',
                    ],
                ],
            ],
        ],
    ],
    [
        'data' => [
            'createOrder' => [
                'paymentMethod' => 'Bvr',
                'balanceCHF' => '0.00',
                'balanceEUR' => '10.12',
                'orderLines' => [
                    [
                        'quantity' => 1,
                        'type' => 'Digital',
                        'balanceCHF' => '0.00',
                        'balanceEUR' => '10.12',
                    ],
                ],
            ],
        ],
    ],
];
