<?php

declare(strict_types=1);

use Application\Model\User;

return [
    [
        'query' => 'mutation ($inputUser: UserPartialInput!) {
            updateUser(id: 1001 input: $inputUser) {
                id
                name
                email
            }
        }',
        'variables' => [
            'inputUser' => [
                'name' => 'test name',
                'email' => 'test@example.com',
                'role' => User::ROLE_MEMBER,
            ],
        ],
    ],
    [
        'data' => [
            'updateUser' => [
                'id' => 1001,
                'name' => 'test name',
                'email' => 'test@example.com',
            ],
        ],
    ],
];
