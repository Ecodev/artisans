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
                        'product' => 3000,
                        'quantity' => 250,
                        'isCHF' => true,
                        'type' => 'Digital',
                    ],
                    [
                        'product' => 3001,
                        'quantity' => 1,
                        'isCHF' => true,
                        'type' => 'Paper',
                    ],
                ],
            ],
        ],
    ],
    [
        'data' => [
            'createOrder' => [
                'paymentMethod' => 'Bvr',
                'balanceCHF' => '3765.00',
                'balanceEUR' => '0.00',
                'orderLines' => [
                    [
                        'quantity' => 250,
                        'type' => 'Digital',
                        'balanceCHF' => '3750.00',
                        'balanceEUR' => '0.00',
                    ],
                    [
                        'quantity' => 1,
                        'type' => 'Paper',
                        'balanceCHF' => '15.00',
                        'balanceEUR' => '0.00',
                    ],
                ],
            ],
        ],

    ],
];
