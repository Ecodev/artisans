<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            permissions {
                crud {
                    configuration { create }
                    news { create }
                    newsletter { create }
                    session { create }
                    subscription { create }
                    userProduct { create }
                    product { create }
                    productTag { create }
                    image { create }
                    message { create }
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
                    'configuration' => [
                        'create' => false,
                    ],
                    'news' => [
                        'create' => true,
                    ],
                    'newsletter' => [
                        'create' => true,
                    ],
                    'session' => [
                        'create' => true,
                    ],
                    'subscription' => [
                        'create' => true,
                    ],
                    'userProduct' => [
                        'create' => true,
                    ],
                    'product' => [
                        'create' => true,
                    ],
                    'productTag' => [
                        'create' => true,
                    ],
                    'image' => [
                        'create' => true,
                    ],
                    'message' => [
                        'create' => false,
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
