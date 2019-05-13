<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation ($inputTransaction: TransactionInput!, $lines: [TransactionLineInput!]!) {
            createTransaction(input: $inputTransaction, lines: $lines) {
                name
                transactionLines {
                    balance
                    credit {
                        balance
                    }
                    debit {
                        balance
                    }
                }
            }
        }',
        'variables' => [
            'inputTransaction' => [
                'name' => 'Le club achète un nouveau voilier',
                'transactionDate' => '2019-02-04',
            ],
            'lines' => [
                [
                    'name' => 'Acquisition voilier NE123456',
                    'balance' => '10000.00',
                    'transactionDate' => '2019-02-03',
                    'debit' => 10900,
                ],
                [
                    'name' => 'Paiement cash',
                    'balance' => '7000.00',
                    'transactionDate' => '2019-02-03',
                    'credit' => 10029,
                ],
                [
                    'name' => 'Paiement par Raiffeisen',
                    'balance' => '3000.00',
                    'transactionDate' => '2019-02-04',
                    'credit' => 10030,
                ],
            ],
        ],
    ],
    [
        'data' => [
            'createTransaction' => [
                'name' => 'Le club achète un nouveau voilier',
                'transactionLines' => [
                    [
                        'balance' => '10000.00',
                        'credit' => null,
                        'debit' => [
                            'balance' => '-10000.00',
                        ],
                    ],
                    [
                        'balance' => '7000.00',
                        'credit' => [
                            'balance' => '-6500.00',
                        ],
                        'debit' => null,
                    ],
                    [
                        'balance' => '3000.00',
                        'credit' => [
                            'balance' => '19700.00',
                        ],
                        'debit' => null,
                    ],
                ],
            ],
        ],
    ],
];
