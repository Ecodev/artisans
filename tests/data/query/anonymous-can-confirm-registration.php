<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation  ($input: ConfirmRegistrationInput!) {
             confirmRegistration(token: "09876543210987654321098765432109", input: $input)
        }',
        'variables' => [
            'input' => [
                'password' => 'douzecaracteres',
                'firstName' => 'John',
                'lastName' => 'Doe',
                'street' => 'Wallstreet',
                'locality' => 'New York',
                'postcode' => '2000',
                'country' => '1',
            ],
        ],
    ],
    [
        'data' => [
            'confirmRegistration' => true,
        ],
    ],
    function (Doctrine\DBAL\Connection $connection): void {
        // create a valid token for right now
        $connection->update(
            'user',
            [
                'token' => '09876543210987654321098765432109',
                'token_creation_date' => Cake\Chronos\Chronos::now()->subMinutes(1)->toIso8601String(),
            ],
            [
                'email' => 'administrator@example.com',
            ]
        );
    },
];
