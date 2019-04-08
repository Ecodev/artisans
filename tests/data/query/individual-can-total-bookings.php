<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            bookings {
                totalParticipantCount
                totalInitialPrice
                totalPeriodicPrice
            }
        }',
    ],
    [
        'data' => [
            'bookings' => [
                'totalParticipantCount' => 11,
                'totalInitialPrice' => '0.00',
                'totalPeriodicPrice' => '240.00',
            ],
        ],
    ],
];
