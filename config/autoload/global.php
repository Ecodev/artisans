<?php

declare(strict_types=1);

/**
 * Default configuration that can be overridden by a local.php, but it at least ensure
 * that required keys exist with "safe" values.
 */
return [
    'hostname' => 'my-ichtus.lan',
    'fromEmail' => 'noreply@my-ichtus.lan',
    'emailOverride' => null,
    'smtp' => null,
    'phpPath' => '/usr/bin/php',
    'doorsApi' => [
        'endpoint' => 'http://localhost:8888',
        'token' => 'my-token-value',
        'authorizedIps' => ['localhost'],
    ],
];
