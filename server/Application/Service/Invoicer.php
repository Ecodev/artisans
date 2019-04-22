<?php

declare(strict_types=1);

namespace Application\Service;

use Application\Model\Account;
use Application\Model\Product;
use Application\Model\Transaction;
use Application\Model\TransactionLine;
use Application\Model\User;
use Application\Repository\AccountRepository;
use Cake\Chronos\Date;
use Doctrine\ORM\EntityManager;

/**
 * Service to create transactions for product, if needed, for all users or one user
 */
class Invoicer
{
    /**
     * @var EntityManager
     */
    private $entityManager;

    /**
     * @var int
     */
    private $count = 0;

    /**
     * @var AccountRepository
     */
    private $accountRepository;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->accountRepository = $this->entityManager->getRepository(Account::class);
    }

    public function createTransaction(?User $user, array $products): void
    {
        if (!$user || !$products) {
            return;
        }

        $this->accountRepository->getAclFilter()->setEnabled(false);
        $account = $this->accountRepository->getOrCreate($user);
        $transaction = new Transaction();
        $transaction->setTransactionDate(Date::today());
        $transaction->setName('Achats ' . Date::today()->toDateString());
        $this->entityManager->persist($transaction);

        foreach ($products as $product) {
            $balance = $this->calculateInitialBalance($product);
            $this->createTransactionLine($transaction, $product, $account, $balance);
        }

        ++$this->count;

        $this->accountRepository->getAclFilter()->setEnabled(true);
    }

    /**
     * @param Product $product
     *
     * @return string
     */
    private function calculateInitialBalance(Product $product): string
    {
        return $product->getPricePerUnit();
    }

    private function createTransactionLine(Transaction $transaction, Product $product, Account $account, string $balance): void
    {
        if ($balance > 0) {
            $debit = $account;
            $credit = $product->getCreditAccount();
        } elseif ($balance < 0) {
            $debit = $product->getCreditAccount();
            $credit = $account;
            $balance = bcmul($balance, '-1'); // into positive
        } else {
            // Never create a line with 0 balance
            return;
        }

        $transactionLine = new TransactionLine();
        $this->entityManager->persist($transactionLine);

        $transactionLine->setName($product->getName());
        $transactionLine->setProduct($product);
        $transactionLine->setDebit($debit);
        $transactionLine->setCredit($credit);
        $transactionLine->setBalance($balance);
        $transactionLine->setTransaction($transaction);
        $transactionLine->setTransactionDate(Date::today());
    }
}
