<?php

declare(strict_types=1);

use Application\DBAL\Types\OrderTypeType;

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
                'quantity' => '20',
                'isCHF' => true,
                'type' => OrderTypeType::DIGITAL,
            ],
        ],
    ],
    [
        'data' => [
            'updateOrderLine' => [
                'product' => [
                    'id' => '3001',
                ],
                'quantity' => '20.000',
                'balanceCHF' => '200.00',
                'balanceEUR' => '0.00',
                'type' => OrderTypeType::DIGITAL,
                'order' => [
                    'balanceCHF' => '200.00',
                    'balanceEUR' => '0.00',
                ],
            ],
        ],
    ],
];
