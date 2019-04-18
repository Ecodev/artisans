<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            updatePassword(password: "douzecaracteres", token: "09876543210987654321098765432109")
        }',
    ],
    [
        'data' => [
            'updatePassword' => false,
        ],
    ],
];
