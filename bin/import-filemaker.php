#! /usr/bin/env php
<?php

use Application\Service\Importer;

$container = require_once 'server/cli.php';

/** @var Importer $importer */
$importer = $container->get(Importer::class);

$importer->import();
