#! /usr/bin/env php
<?php

use Application\Service\AbstractDatabase;

require_once 'server/cli.php';

$options = getopt('', ['site:']);

if (!is_array($options) || !isset($options['site'])) {
    echo PHP_EOL . "Usage: $argv[0] --site=artisansdelatransition.org" . PHP_EOL . PHP_EOL;
    exit;
}

AbstractDatabase::loadRemoteData($options['site']);
