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
                    facilitatorDocument { create }
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
                        'create' => true,
                    ],
                    'news' => [
                        'create' => true,
                    ],
                    'session' => [
                        'create' => true,
                    ],
                    'subscription' => [
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
                    'facilitatorDocument' => [
                        'create' => true,
                    ],
                ],
            ],
        ],
    ],
];
