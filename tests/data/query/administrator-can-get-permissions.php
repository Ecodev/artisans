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
                    category { create }
                    country { create }
                    expenseClaim { create }
                    image { create }
                    license { create }
                    message { create }
                    transaction { create }
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
                    'booking' => [
                        'create' => true,
                    ],
                    'category' => [
                        'create' => true,
                    ],
                    'country' => [
                        'create' => false,
                    ],
                    'expenseClaim' => [
                        'create' => true,
                    ],
                    'image' => [
                        'create' => true,
                    ],
                    'license' => [
                        'create' => true,
                    ],
                    'message' => [
                        'create' => false,
                    ],
                    'transaction' => [
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
