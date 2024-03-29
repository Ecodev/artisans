<?php

declare(strict_types=1);

$args = require 'member-can-create-order.php';

return [
    $args[0], // Exact same successful mutation should fail with wrong user
    [
        'errors' => [
            [
                'message' => 'Non-logged user with role anonymous is not allowed on resource "Order#null" with privilege "create"',
                'extensions' => [
                    'showSnack' => true,
                ],
                'locations' => [
                    [
                        'line' => 2,
                        'column' => 13,
                    ],
                ],
                'path' => [
                    'createOrder',
                ],
            ],
        ],
        'data' => [
            'createOrder' => null,
        ],
    ],
];
