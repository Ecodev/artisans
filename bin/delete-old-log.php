#! /usr/bin/env php
<?php

use Application\Model\Log;

require_once __DIR__ . '/../htdocs/index.php';

$count = _em()->getRepository(Log::class)->deleteOldLogs();

echo "$count logs entry deleted\n";
