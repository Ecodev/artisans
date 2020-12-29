<?php

declare(strict_types=1);

use Application\Model\User;

$args = require 'member-can-get-user-roles-available.php';

return [
    $args[0], // Exact same query
    [
        'data' => [
            'newUser' => [
                User::ROLE_MEMBER,
                User::ROLE_FACILITATOR,
                User::ROLE_ADMINISTRATOR,

            ],
            'member' => [
                User::ROLE_MEMBER,
                User::ROLE_FACILITATOR,
                User::ROLE_ADMINISTRATOR,
            ],
            'administrator' => [
                User::ROLE_MEMBER,
                User::ROLE_FACILITATOR,
                User::ROLE_ADMINISTRATOR,
            ],
        ],
    ],
];
