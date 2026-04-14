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

function test(
    string $url,
    string $pattern = '<img class="boot-logo" src="assets/logo-artisans-de-la-transition.svg"',
    string $message = 'should get raw Angular',
): void {
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
test('https://artisans.lan/sitemap.xml', '<loc>https://artisans.lan/association/nos-convictions</loc>', 'should get sitemap');

echo '❤️  All tests OK' . PHP_EOL;
