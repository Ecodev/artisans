<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            permissions {
                crud {
                    account { create }
                    accountingDocument { create }
                    product { create }
                    productMetadata { create }
                    productTag { create }
                    expenseClaim { create }
                    image { create }
                    message { create }
                    transaction { create }
                    transactionTag { create }
                    user { create }
                    userTag { create }
                }
            }
        }',
        'variables' => [
        ],
    ],
    [
        'data' => [
            'permissions' => [
                'crud' => [
                    'account' => [
                        'create' => false,
                    ],
                    'accountingDocument' => [
                        'create' => false,
                    ],
                    'product' => [
                        'create' => false,
                    ],
                    'productMetadata' => [
                        'create' => false,
                    ],
                    'productTag' => [
                        'create' => false,
                    ],
                    'expenseClaim' => [
                        'create' => false,
                    ],
                    'image' => [
                        'create' => false,
                    ],
                    'message' => [
                        'create' => false,
                    ],
                    'transaction' => [
                        'create' => false,
                    ],
                    'transactionTag' => [
                        'create' => false,
                    ],
                    'user' => [
                        'create' => false,
                    ],
                    'userTag' => [
                        'create' => false,
                    ],
                ],
            ],
        ],
    ],
];
