<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            requestPasswordReset(email: "administrator@example.com")
        }',
    ],
    [
        'data' => [
            'requestPasswordReset' => true,
        ],
    ],
];
