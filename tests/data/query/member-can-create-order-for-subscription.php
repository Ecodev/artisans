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
                    additionalEmails
                }
            }
        }',
        'variables' => [
            'input' => [
                'paymentMethod' => 'Bvr',
                'orderLines' => [
                    [
                        'subscription' => 19005,
                        'quantity' => 1,
                        'isCHF' => true,
                        'type' => 'Digital',
                        'additionalEmails' => [
                            'foo@example.com',
                            'bar@example.com',
                        ],
                    ],
                ],
            ],
        ],
    ],
    [
        'data' => [
            'createOrder' => [
                'paymentMethod' => 'Bvr',
                'balanceCHF' => '185.00',
                'balanceEUR' => '0.00',
                'orderLines' => [
                    [
                        'quantity' => 1,
                        'type' => 'Both',
                        'balanceCHF' => '185.00',
                        'balanceEUR' => '0.00',
                        'additionalEmails' => [
                            'foo@example.com',
                            'bar@example.com',
                        ],
                    ],
                ],
            ],
        ],

    ],
];
