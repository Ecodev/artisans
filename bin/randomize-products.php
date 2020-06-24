#! /usr/bin/env php
<?php

use Ecodev\Felix\Service\AbstractDatabase;

require_once 'server/cli.php';

$config = require 'config/autoload/local.php';
$dbConfig = $config['doctrine']['connection']['orm_default']['params'];
$host = $dbConfig['host'];
$username = $dbConfig['user'];
$database = $dbConfig['dbname'];
$password = $dbConfig['password'];

$countAndUpdate = 'SELECT COUNT(*) INTO @productCount FROM product; UPDATE product SET sorting = FLOOR(1 + RAND() * @productCount);';
$fullQuery = "mysql -v --user=$username --password=$password --host=$host $database -e \"" . $countAndUpdate . '"';

AbstractDatabase::executeLocalCommand($fullQuery);
