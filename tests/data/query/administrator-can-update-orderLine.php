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
                    quantity
                    delta
                    product {
                        id
                    }
                }
            }
        }',
        'variables' => [
            'input' => [
                'product' => 3001,
                'quantity' => '20',
                'pricePonderation' => '0.5',
            ],
        ],
    ],
    [
        'data' => [
            'updateOrderLine' => [
                'product' => [
                    'id' => '3001',
                    'quantity' => '-8.000',
                ],
                'quantity' => '20.000',
                'pricePonderation' => '0.50',
                'balance' => '240.00',
                'vatPart' => '17.16',
                'order' => [
                    'balance' => '257.40',
                    'vatPart' => '17.58',
                    'transaction' => [
                        'transactionLines' => [
                            [
                                'balance' => '257.40',
                            ],
                        ],
                        'balance' => '257.40',
                    ],
                ],
                'stockMovement' => [
                    'quantity' => '-8.000',
                    'delta' => '-20.000',
                    'product' => [
                        'id' => '3001',
                    ],
                ],
            ],
        ],
    ],
];
