<?php

declare(strict_types=1);

use Application\DBAL\Types\RelationshipType;

return [
    [
        'query' => 'mutation {
            requestPasswordReset(login: "non-existing-user-login")
        }',
    ],
    [
        'data' => [
            'requestPasswordReset' => RelationshipType::HOUSEHOLDER,
        ],
    ],
];
