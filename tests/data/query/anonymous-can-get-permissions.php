<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            permissions {
                crud {
                    configuration { create }
                    news { create }
                    session { create }
                    subscription { create }
                    product { create }
                    productTag { create }
                    image { create }
                    message { create }
                    user { create }
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
                        'create' => false,
                    ],
                    'session' => [
                        'create' => false,
                    ],
                    'subscription' => [
                        'create' => false,
                    ],
                    'product' => [
                        'create' => false,
                    ],
                    'productTag' => [
                        'create' => false,
                    ],
                    'image' => [
                        'create' => false,
                    ],
                    'message' => [
                        'create' => false,
                    ],
                    'user' => [
                        'create' => false,
                    ],
                ],
            ],
        ],
    ],
];
