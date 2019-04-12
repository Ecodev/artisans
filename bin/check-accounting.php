#! /usr/bin/env php
<?php

/**
 * A script to check that accounts are balanced
 */
use Application\DBAL\Types\AccountTypeType;
use Application\Model\Account;
use Application\Model\Transaction;

require_once 'server/cli.php';

$repo = _em()->getRepository(Account::class);

$assets = $repo->totalBalanceByType(AccountTypeType::ASSET);
$liabilities = $repo->totalBalanceByType(AccountTypeType::LIABILITY);
$revenue = $repo->totalBalanceByType(AccountTypeType::REVENUE);
$expense = $repo->totalBalanceByType(AccountTypeType::EXPENSE);
$equity = $repo->totalBalanceByType(AccountTypeType::EQUITY);

$income = bcsub($revenue, $expense);

$discrepancy = bcsub(bcsub($assets, $income), bcadd($liabilities, $equity));

echo '
Produits  : ' . $revenue . '
Charges   : ' . $expense . '
' . ($income >= 0 ? 'Bénéfice  : ' : 'Déficit   : ') . $income . '
Actifs    : ' . $assets . '
Passifs   : ' . $liabilities . '
Capital   : ' . $equity . '
Écart     : ' . $discrepancy . PHP_EOL;

$errors = [];

if (bccomp($discrepancy, '0.00') !== 0) {
    $errors[] = sprintf('ERREUR: écart de %s au bilan des comptes!', $discrepancy);
}

foreach (_em()->getRepository(Transaction::class)->findAll() as $transaction) {
    $totalDebit = '0.00';
    $totalCredit = '0.00';
    foreach ($transaction->getTransactionLines() as $line) {
        if ($line->getDebit()) {
            $totalDebit = bcadd($totalDebit, $line->getBalance());
        }
        if ($line->getCredit()) {
            $totalCredit = bcadd($totalCredit, $line->getBalance());
        }
    }
    if (bccomp($totalDebit, $totalCredit) !== 0) {
        $errors[] = sprintf('ERREUR: transaction %u non-équilibrée, débit: %s, crédit: %s', $transaction->getId(), $totalDebit, $totalCredit);
    }
}

if (count($errors)) {
    echo PHP_EOL . implode(PHP_EOL, $errors) . PHP_EOL . PHP_EOL;
    exit(1);
}
