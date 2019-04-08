#! /usr/bin/env php
<?php

use Application\Service\Invoicer;

$container = require_once 'server/cli.php';

/** @var Invoicer $invoicer */
$invoicer = $container->get(Invoicer::class);
$count = $invoicer->invoice();

echo $count . ' invoices created' . PHP_EOL;
