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
                        'create' => true,
                    ],
                    'accountingDocument' => [
                        'create' => true,
                    ],
                    'product' => [
                        'create' => true,
                    ],
                    'productMetadata' => [
                        'create' => true,
                    ],
                    'productTag' => [
                        'create' => true,
                    ],
                    'expenseClaim' => [
                        'create' => true,
                    ],
                    'image' => [
                        'create' => true,
                    ],
                    'message' => [
                        'create' => false,
                    ],
                    'transaction' => [
                        'create' => true,
                    ],
                    'transactionTag' => [
                        'create' => true,
                    ],
                    'user' => [
                        'create' => true,
                    ],
                    'userTag' => [
                        'create' => true,
                    ],
                ],
            ],
        ],
    ],
];
