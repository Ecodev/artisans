<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            login(email: "administrator@example.com" password: "administrator") {
                id
                email
            }
        }',
    ],
    [
        'data' => [
            'login' => [
                'id' => '1000',
                'email' => 'administrator@example.com',
            ],
        ],
    ],
];
