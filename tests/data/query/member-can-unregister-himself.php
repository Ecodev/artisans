<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            unregister(id: 1002)
        }',
    ],
    [
        'data' => [
            'unregister' => true,
        ],
    ],
];
