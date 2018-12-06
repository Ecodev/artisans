<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            viewer {
                globalPermissions {
                country { create }
                license { create }
                user { create }
                }
            }

            user (id: 1000) {
                permissions {
                    create
                    read
                    update
                    delete
                }
            }
        }',
    ],
    [
        'data' => [
            'viewer' => [
                'globalPermissions' => [
                    'country' => [
                        'create' => false,
                    ],
                    'license' => [
                        'create' => true,
                    ],
                    'user' => [
                        'create' => false,
                    ],
                ],
            ],
            'user' => [
                'permissions' => [
                    'create' => false,
                    'read' => true,
                    'update' => false,
                    'delete' => false,
                ],
            ],
        ],
    ],
];
