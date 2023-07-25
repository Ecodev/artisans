#! /usr/bin/env php
<?php

$container = require_once 'server/cli.php';

$config = $container->get('config');

$clientKeys = [
    'datatrans',
];

$clientConfig = array_intersect_key($config, array_flip($clientKeys));
$clientConfig['log']['url'] = $config['log']['url'];
$clientConfig['signedQueries']['key'] = $config['signedQueries']['keys'][0] ?? '';

$json = json_encode($clientConfig, JSON_PRETTY_PRINT);
$code = <<<STRING
    /* eslint-disable */
    /* eslint-disable */
    export const localConfig = $json as const;
    STRING;

file_put_contents('client/app/shared/generated-config.ts', $code);
