<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            transactionLines {
                totalBalance
            }
        }',
    ],
    [
        'data' => [
            'transactionLines' => [
                'totalBalance' => '27827.40',
            ],
        ],
    ],
];
