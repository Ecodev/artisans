#! /usr/bin/env php
<?php

use Application\Service\AbstractDatabase;

require_once 'server/cli.php';

AbstractDatabase::loadTestData();
