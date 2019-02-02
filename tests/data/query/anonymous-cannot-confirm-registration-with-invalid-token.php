<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation  ($input: ConfirmRegistrationInput!) {
             confirmRegistration(token: "09876543210987654321098765432109", input: $input)
        }',
        'variables' => [
            'input' => [
                'login' => 'john.doe',
                'password' => 'money12345',
                'firstName' => 'John',
                'lastName' => 'Doe',
                'street' => 'Wallstreet',
                'postcode' => '2000',
            ],
        ],
    ],
    [
        'errors' => [
            [
                'message' => 'Cannot confirm registration with an invalid token',
                'extensions' => [
                    'category' => 'Permissions',
                ],
                'locations' => [
                    [
                        'line' => 2,
                        'column' => 14,
                    ],
                ],
                'path' => [
                    'confirmRegistration',
                ],
            ],
        ],
    ],
];
