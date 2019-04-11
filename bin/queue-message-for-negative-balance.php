#! /usr/bin/env php
<?php

use Application\Service\MessageQueuer;
use Cake\Chronos\Date;

$container = require_once 'server/cli.php';

$currentMonth = Date::today()->format('m');
if ($currentMonth === '01') {
    echo 'Emails for accounts with negative balances were not queued because it is January.' . PHP_EOL;
    echo 'Instead an email to everybody should be queued manually via `./bin/queue-message-for-all-balance.php`.' . PHP_EOL;
    exit(1);
}

/** @var MessageQueuer $messageQueuer */
$messageQueuer = $container->get(MessageQueuer::class);
$count = $messageQueuer->queueNegativeBalance();
_em()->flush();

echo $count . ' messages queued' . PHP_EOL;
