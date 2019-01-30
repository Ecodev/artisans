#! /usr/bin/env php
<?php

use Application\Service\Mailer;

$container = require_once 'server/cli.php';

/** @var Mailer $mailer */
$mailer = $container->get(Mailer::class);
$mailer->sendAllMessages();
