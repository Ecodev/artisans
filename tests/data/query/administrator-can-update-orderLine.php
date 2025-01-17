<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation ($input:  OrderLineInput!) {
            updateOrderLine(id: 17000, input: $input) {
                product {
                    id
                }
                quantity
                balanceCHF
                balanceEUR
                type
                order {
                    balanceCHF
                    balanceEUR
                }
            }
        }',
        'variables' => [
            'input' => [
                'product' => 3001,
                'quantity' => 20,
                'isCHF' => true,
                'type' => 'Digital',
            ],
        ],
    ],
    [
        'data' => [
            'updateOrderLine' => [
                'product' => [
                    'id' => '3001',
                ],
                'quantity' => 20,
                'balanceCHF' => '300.00',
                'balanceEUR' => '0.00',
                'type' => 'Digital',
                'order' => [
                    'balanceCHF' => '305.00',
                    'balanceEUR' => '0.00',
                ],
            ],
        ],
    ],
];
