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
                        'isCHF' => true,
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
                'balanceCHF' => '10.12',
                'balanceEUR' => '0.00',
                'orderLines' => [
                    [
                        'quantity' => 1,
                        'type' => 'Digital',
                        'balanceCHF' => '10.12',
                        'balanceEUR' => '0.00',
                    ],
                ],
            ],
        ],
    ],
];
