#! /usr/bin/env php
<?php

declare(strict_types=1);

$container = require_once 'server/cli.php';

$config = $container->get('config');

$clientKeys = [
    'version',
    'datatrans',
];

$clientConfig = array_intersect_key($config, array_flip($clientKeys));
$clientConfig['log']['url'] = $config['log']['url'];
$clientConfig['signedQueries']['key'] = $config['signedQueries']['keys'][0] ?? '';

$json = json_encode($clientConfig, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
$code = <<<STRING
    export const localConfig = $json as const;
    STRING;

file_put_contents('client/app/shared/generated-config.ts', $code);
