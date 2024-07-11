#! /usr/bin/env php
<?php

declare(strict_types=1);

/**
 * A script to show missing files on disk and non-needed files on disk.
 *
 * It is up to the user to then take appropriate action based on that information.
 */

use Ecodev\Felix\Service\FileChecker;

require_once 'server/cli.php';

$checker = new FileChecker(_em()->getConnection());

$checker->check([
    'image' => 'data/images/',
    'file' => 'data/file/',
]);
