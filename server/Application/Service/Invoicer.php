<?php

declare(strict_types=1);

namespace Application\Service;

use Application\Model\Account;
use Application\Model\Bookable;
use Application\Model\Transaction;
use Application\Model\TransactionLine;
use Application\Model\User;
use Application\Repository\AccountRepository;
use Cake\Chronos\Date;
use Doctrine\ORM\EntityManager;

/**
 * Service to create transactions for bookable, if needed, for all users or one user
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

    public function invoiceInitial(User $user, Bookable $bookable): void
    {
        $this->accountRepository->getAclFilter()->setEnabled(false);

        if (!$bookable->getInitialPrice() && !$bookable->getPeriodicPrice()) {
            return;
        }

        $this->createTransaction($user, [$bookable]);
        $this->accountRepository->getAclFilter()->setEnabled(true);
    }

    private function createTransaction(?User $user, array $bookables): void
    {
        if (!$user || !$bookables) {
            return;
        }

        $account = $this->accountRepository->getOrCreate($user);
        $transaction = new Transaction();
        $transaction->setTransactionDate(Date::today());
        $transaction->setName('Achats ' . Date::today()->toDateString());
        $this->entityManager->persist($transaction);

        foreach ($bookables as $bookable) {
            $balance = $this->calculateInitialBalance($bookable);
            $this->createTransactionLine($transaction, $bookable, $account, $balance);
        }

        ++$this->count;
    }

    /**
     * @param Bookable $bookable
     *
     * @return string
     */
    private function calculateInitialBalance(Bookable $bookable): string
    {
        return $bookable->getInitialPrice();
    }

    private function createTransactionLine(Transaction $transaction, Bookable $bookable, Account $account, string $balance): void
    {
        if ($balance > 0) {
            $debit = $account;
            $credit = $bookable->getCreditAccount();
        } elseif ($balance < 0) {
            $debit = $bookable->getCreditAccount();
            $credit = $account;
            $balance = bcmul($balance, '-1'); // into positive
        } else {
            // Never create a line with 0 balance
            return;
        }

        $transactionLine = new TransactionLine();
        $this->entityManager->persist($transactionLine);

        $transactionLine->setName($bookable->getName());
        $transactionLine->setBookable($bookable);
        $transactionLine->setDebit($debit);
        $transactionLine->setCredit($credit);
        $transactionLine->setBalance($balance);
        $transactionLine->setTransaction($transaction);
        $transactionLine->setTransactionDate(Date::today());
    }
}
