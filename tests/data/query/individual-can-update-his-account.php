<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation ($inputAccount: AccountPartialInput!) {
            updateAccount(id: 10097 input: $inputAccount) {
                id
                name
            }
        }',
        'variables' => [
            'inputAccount' => [
                'name' => 'test name',
            ],
        ],
    ],
    [
        'data' => [
            'updateAccount' => [
                'id' => 10097,
                'name' => 'test name',
            ],
        ],
    ],
];
