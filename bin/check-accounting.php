#! /usr/bin/env php
<?php

/**
 * A script to check that accounts are balanced
 */
use Application\DBAL\Types\AccountTypeType;
use Application\Model\Account;

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

if (bccomp($discrepancy, '0.00') !== 0) {
    exit(1);
}
