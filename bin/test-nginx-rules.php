#! /usr/bin/env php
<?php

declare(strict_types=1);

/**
 * Script to test the most important nginx rules.
 */
function run(string $cmd): string
{
    echo $cmd . PHP_EOL;

    return shell_exec($cmd);
}

function test(string $url): void
{
    $pattern = '<img src="assets/logo-artisans-de-la-transition.svg"';
    $message = 'logged in user should get raw Angular';

    // Assert HTTP status code
    $status = run("curl --insecure --silent --output /dev/null --write-out '%{http_code}' '$url'");
    if ($status !== '200') {
        echo "FAILED STATUS CODE: $status: $message" . PHP_EOL;
        exit(1);
    }

    // Assert HTML content
    $content = run("curl --insecure --silent '$url'");
    if (!str_contains($content, $pattern)) {
        echo "FAILED PATTERN: '$pattern': $message" . PHP_EOL;
        exit(1);
    }
}

test('https://artisans.lan');
test('https://artisans.lan/larevuedurable/numeros');
test('https://artisans.lan/mon-compte');

test('https://artisans.lan');
test('https://artisans.lan/larevuedurable/numeros');
test('https://artisans.lan/mon-compte');
test('https://artisans.lan/sitemap.xml');

echo '❤️  All tests OK' . PHP_EOL;
