<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            invoice(id: -1005)
        }',
    ],
    [
        'data' => [
            'invoice' => true,
        ],
    ],
];
