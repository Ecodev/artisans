<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation ($input:  OrderLineInput!) {
            updateOrderLine(id: 17000, input: $input) {
                product {
                    id
                    quantity
                }
                quantity
                pricePonderation
                balance
                vatPart
                order {
                    balance
                    vatPart
                    transaction {
                        transactionLines {
                            balance
                        }
                        balance
                    }
                }
                stockMovement {
                    delta
                    quantity
                    product {
                        id
                    }
                }
            }
        }',
        'variables' => [
            'input' => [
                'product' => 3011,
                'quantity' => '20',
                'pricePonderation' => '0.5',
            ],
        ],
    ],
    [
        'data' => [
            'updateOrderLine' => [
                'product' => [
                    'id' => '3011',
                    'quantity' => '-15.000',
                ],
                'quantity' => '20.000',
                'pricePonderation' => '0.50',
                'balance' => '125.00',
                'vatPart' => '0.00',
                'order' => [
                    'balance' => '142.40',
                    'vatPart' => '0.42',
                    'transaction' => [
                        'transactionLines' => [
                            [
                                'balance' => '142.40',
                            ],
                        ],
                        'balance' => '142.40',
                    ],
                ],
                'stockMovement' => [
                    'delta' => '-20.000',
                    'quantity' => '-12.000',
                    'product' => [
                        'id' => '3011',
                    ],
                ],
            ],
        ],
    ],
];
