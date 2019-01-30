#! /usr/bin/env php
<?php

use Application\Service\AbstractDatabase;

require_once 'server/cli.php';

AbstractDatabase::dumpData($argv[1] ?? 'db.backup.sql.gz');
