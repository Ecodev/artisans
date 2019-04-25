<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation ($inputAccount: AccountPartialInput!) {
            updateAccount(id: -1002 input: $inputAccount) {
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
                'id' => -1002,
                'name' => 'test name',
            ],
        ],
    ],
];
