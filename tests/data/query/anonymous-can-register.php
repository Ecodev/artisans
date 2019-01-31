<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
             register(email: "new@example.com", hasInsurance: true, termsAgreement: true)
        }',
    ],
    [
        'data' => [
            'register' => true,
        ],
    ],
];
