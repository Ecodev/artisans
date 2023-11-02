<?php

declare(strict_types=1);

return [
    [
        'query' => 'query Message {
            message(id: 11002) {
                subject
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'Entity not found for class `Application\\Model\\Message` and ID `11002`.',
                'extensions' => [
                    'objectNotFound' => true,
                ],
                'locations' => [
                    [
                        'line' => 2,
                        'column' => 13,
                    ],
                ],
                'path' => [
                    'message',
                ],
            ],
        ],
    ],
];
