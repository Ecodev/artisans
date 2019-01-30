<?php

declare(strict_types=1);

use Application\DBAL\Types\RelationshipType;

return [
    [
        'query' => 'mutation {
            requestPasswordReset(login: "son")
        }',
    ],
    [
        'data' => [
            'requestPasswordReset' => RelationshipType::CHILD,
        ],
    ],
];
