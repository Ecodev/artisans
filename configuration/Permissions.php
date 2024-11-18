<?php

declare(strict_types=1);

return [
    [
        'path' => 'data/file',
        'permissions' => '0770',
        'recursive' => false,
    ],
    [
        'path' => 'data/download-file-counter/counter.txt',
        'permissions' => '0770',
        'recursive' => false,
    ],
    [
        'path' => 'data/images',
        'permissions' => '0770',
        'recursive' => false,
    ],
    [
        'path' => 'logs',
        'permissions' => '0770',
        'recursive' => true,
    ],
    [
        'path' => 'data/cache',
        'permissions' => '0770',
        'recursive' => true,
    ],
    [
        'path' => 'data/tmp',
        'permissions' => '0770',
        'recursive' => true,
    ],
    [
        'path' => 'data/session',
        'permissions' => '0770',
        'recursive' => true,
    ],
    [
        'path' => 'bin/build.sh',
        'permissions' => '0750',
    ],
    [
        'path' => 'bin/check-files.php',
        'permissions' => '0750',
    ],
    [
        'path' => 'bin/clean-formatted-content.php',
        'permissions' => '0750',
    ],
    [
        'path' => 'bin/create-triggers.php',
        'permissions' => '0750',
    ],
    [
        'path' => 'bin/send-all-messages.php',
        'permissions' => '0750',
    ],
    [
        'path' => 'bin/delete-old-log.php',
        'permissions' => '0750',
    ],
    [
        'path' => 'bin/dump-data.php',
        'permissions' => '0750',
    ],
    [
        'path' => 'bin/dump-schema',
        'permissions' => '0750',
    ],
    [
        'path' => 'bin/doctrine',
        'permissions' => '0750',
    ],
    [
        'path' => 'bin/generate-client-configuration.php',
        'permissions' => '0750',
    ],
    [
        'path' => 'bin/graphql.php',
        'permissions' => '0750',
    ],
    [
        'path' => 'bin/load-data.php',
        'permissions' => '0750',
    ],
    [
        'path' => 'bin/load-remote-data.php',
        'permissions' => '0750',
    ],
    [
        'path' => 'bin/load-test-data.php',
        'permissions' => '0750',
    ],
    [
        'path' => 'bin/pre-commit.sh',
        'permissions' => '0750',
    ],
    [
        'path' => 'bin/send-message.php',
        'permissions' => '0750',
    ],
    [
        'path' => 'node_modules/.bin/*',
        'permissions' => '0750',
    ],
    [
        'path' => 'node_modules/@esbuild/linux-x64/bin/*',
        'permissions' => '0750',
    ],
    [
        'path' => 'vendor/bin/*',
        'permissions' => '0750',
    ],
];
