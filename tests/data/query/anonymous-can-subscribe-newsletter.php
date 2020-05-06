<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            subscribeNewsletter(email: "administrator@example.com")
        }',
    ],
    [
        'data' => [
            'subscribeNewsletter' => true,
        ],
    ],
];
