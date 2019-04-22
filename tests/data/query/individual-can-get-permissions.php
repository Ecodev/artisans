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
                        'create' => false,
                    ],
                    'bookableMetadata' => [
                        'create' => false,
                    ],
                    'bookableTag' => [
                        'create' => false,
                    ],
                    'expenseClaim' => [
                        'create' => true,
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
