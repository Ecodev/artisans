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
                    booking { create }
                    expenseClaim { create }
                    image { create }
                    license { create }
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
                    'bookable' => [
                        'create' => false,
                    ],
                    'bookableMetadata' => [
                        'create' => false,
                    ],
                    'bookableTag' => [
                        'create' => false,
                    ],
                    'booking' => [
                        'create' => false,
                    ],
                    'expenseClaim' => [
                        'create' => false,
                    ],
                    'image' => [
                        'create' => false,
                    ],
                    'license' => [
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
