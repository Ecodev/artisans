<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation ($inputTransaction: TransactionPartialInput!, $lines: [TransactionLineInput!]) {
            updateTransaction(id: 8000, input: $inputTransaction, lines: $lines) {
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
                'name' => 'Active Member: inscription cours nautique (corrigé)',
            ],
            'lines' => null,
        ],
    ],
    [
        'data' => [
            'updateTransaction' => [
                'name' => 'Active Member: inscription cours nautique (corrigé)',
                'transactionLines' => [
                    [
                        'balance' => '100.00',
                        'credit' => [
                            'balance' => '0.00',
                        ],
                        'debit' => [
                            'balance' => '0.00',
                        ],
                    ],
                ],
            ],
        ],
    ],
];
