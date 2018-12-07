#! /usr/bin/env php
<?php

use Application\Service\AbstractDatabase;

require_once __DIR__ . '/../htdocs/index.php';

AbstractDatabase::dumpData($argv[1] ?? 'db.backup.sql.gz');
