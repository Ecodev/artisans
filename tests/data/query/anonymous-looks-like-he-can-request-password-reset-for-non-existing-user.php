<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            requestPasswordReset(email: "non-existing-user-login@example.com")
        }',
    ],
    [
        'data' => [
            'requestPasswordReset' => true,
        ],
    ],
];
