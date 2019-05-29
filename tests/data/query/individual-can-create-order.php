<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation ($input: [OrderLineInput!]!) {
            createOrder(input: $input) {
                balance
                vatPart
                orderLines {
                    quantity
                    balance
                    vatPart
                    pricePonderation
                    product {
                        id
                        quantity
                    }
                }
                transaction {
                    balance
                    transactionLines {
                        balance
                        credit {
                            owner {
                                login
                            }
                        }
                    }
                }
                creator {
                    account {
                        balance
                    }
                }
            }
        }',
        'variables' => [
            'input' => [
                [
                    'product' => 3012,
                    'quantity' => 250,
                    'pricePonderation' => 1,
                ],
                [
                    'product' => 3007,
                    'quantity' => 1,
                    'pricePonderation' => 1,
                ],
            ],
        ],
    ],
    [
        'data' => [
            'createOrder' => [
                'balance' => '-115.00',
                'vatPart' => '0.71',
                'orderLines' => [
                    [
                        'quantity' => '250',
                        'balance' => '-125.00',
                        'vatPart' => '0.00',
                        'pricePonderation' => '1',
                        'product' => [
                            'id' => '3012',
                            'quantity' => '-245.000',
                        ],
                    ],
                    [
                        'quantity' => '1',
                        'balance' => '10.00',
                        'vatPart' => '0.00',
                        'pricePonderation' => '1',
                        'product' => [
                            'id' => '3007',
                            'quantity' => '6.000',
                        ],
                    ],
                ],
                'transaction' => [
                    'balance' => '115.00',
                    'transactionLines' => [
                        [
                            'balance' => '115.00',
                            'credit' => [
                                'owner' => [
                                    'login' => 'member',
                                ],
                            ],
                        ],
                    ],
                ],
                'creator' => [
                    'account' => [
                        'balance' => '210.20',
                    ],
                ],
            ],
        ],

    ],
];
