#! /usr/bin/env php
<?php

/**
 * Script to test the most important nginx rules.
 */
function run(string $cmd): string
{
    echo $cmd . PHP_EOL;

    return shell_exec($cmd);
}

function test(bool $loggedIn, string $url): void
{
    if ($loggedIn) {
        $cookie = "--cookie 'PHPSESSID=foo'";
        $pattern = '<img src="assets/logo-artisans-de-la-transition.svg"';
        $message = 'logged in user should get raw Angular';
    } else {
        $cookie = '';
        $pattern = '<natural-icon';
        $message = 'anonymous should get pre-rendered page by SSR';
    }

    // Assert HTTP status code
    $status = run("curl --insecure --silent --output /dev/null --write-out '%{http_code}' '$url' $cookie");
    if ($status !== '200') {
        echo "FAILED STATUS CODE: $status: $message" . PHP_EOL;
        exit(1);
    }

    // Assert HTML content
    $content = run("curl --insecure --silent '$url' $cookie");
    if (mb_strpos($content, $pattern) === false) {
        echo "FAILED PATTERN: '$pattern': $message" . PHP_EOL;
        exit(1);
    }
}

test(true, 'https://artisans.lan');
test(true, 'https://artisans.lan/larevuedurable/numeros');
test(true, 'https://artisans.lan/mon-compte');

test(false, 'https://artisans.lan');
test(false, 'https://artisans.lan/larevuedurable/numeros');
test(false, 'https://artisans.lan/mon-compte');

echo 'All tests OK' . PHP_EOL;
