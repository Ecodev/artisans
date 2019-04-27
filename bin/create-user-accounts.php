#! /usr/bin/env php
<?php

/**
 * Make sure users have an (transaction) account,
 * or are owned by a user who has one
 */
use Application\DBAL\Types\AccountTypeType;
use Application\Model\Account;
use Application\Model\User;

require_once 'server/cli.php';

$userRepository = _em()->getRepository(User::class);
$accountRepository = _em()->getRepository(Account::class);

$customersAccountRoot = $accountRepository->findOneById(10038);

$errors = [];

foreach ($userRepository->findAll() as $user) {
    if ($user->isFamilyOwner()) {
        echo sprintf('Utilisateur %d (%s %s) est un coopérateur', $user->getId(), $user->getFirstName(), $user->getLastName()) . PHP_EOL;
        if (!$user->getAccount()) {
            $accountNumber = sprintf('2030%03u', abs($user->getId())); // 2030 (Acomptes de client) & UserID = n° de compte unique
            echo sprintf('Création du compte %d pour l\'utilisateur %d...', $accountNumber, $user->getId()) . PHP_EOL;
            $account = new Account();
            $account->setOwner($user);
            $account->setName(implode(' ', [$user->getFirstName(), $user->getLastName()]));
            $account->setType(AccountTypeType::LIABILITY);
            $account->setParent($customersAccountRoot);
            $account->setCode($accountNumber);
            _em()->persist($account);
        }
    } else {
        echo sprintf('Utilisateur %d (%s %s) est un %s', $user->getId(), $user->getFirstName(), $user->getLastName(), $user->getFamilyRelationship()) . PHP_EOL;
        if ($user->getAccount()) {
            $errors[] = sprintf(
                'WARN: utilisateur %d ne devrait pas avoir son propre compte débiteur mais partager celui du membre %d',
                $user->getId(),
                $user->getOwner()->getId()
            );
        }
    }
}

_em()->flush();

if (count($errors)) {
    echo PHP_EOL . implode(PHP_EOL, $errors) . PHP_EOL . PHP_EOL;
    exit(1);
}
