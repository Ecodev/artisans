#! /usr/bin/env php
<?php

/**
 * A script to check that accounts are balanced
 */
use Application\Model\Account;

require_once 'server/cli.php';

$repo = _em()->getRepository(Account::class);

$assets = $repo->totalBalanceByType('asset');
$liabilities = $repo->totalBalanceByType('liability');
$revenue = $repo->totalBalanceByType('revenue');
$expense = $repo->totalBalanceByType('expense');
$equity = $repo->totalBalanceByType('equity');

bcscale(2);

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
