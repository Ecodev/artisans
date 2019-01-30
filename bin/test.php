#! /usr/bin/env php
<?php

use Application\Service\Mailer;
use Doctrine\ORM\EntityManager;

$container = require_once 'server/cli.php';

/** @var EntityManager $entityManager */
$entityManager = $container->get(EntityManager::class);

/** @var Mailer $mailer */
$mailer = $container->get(Mailer::class);

$user = $entityManager->getRepository(\Application\Model\User::class)->findOneById(1000);
$m = $mailer->queueResetPassword($user);
echo $m->getBody();
