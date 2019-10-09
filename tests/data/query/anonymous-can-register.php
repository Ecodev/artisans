<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
             register(email: "new@example.com")
        }',
    ],
    [
        'data' => [
            'register' => true,
        ],
    ],
];
