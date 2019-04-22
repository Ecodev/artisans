<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            permissions {
                crud {
                    account { create }
                    accountingDocument { create }
                    bookable { create }
                    bookableMetadata { create }
                    bookableTag { create }
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
                    'bookable' => [
                        'create' => true,
                    ],
                    'bookableMetadata' => [
                        'create' => true,
                    ],
                    'bookableTag' => [
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
