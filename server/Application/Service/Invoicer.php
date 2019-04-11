<?php

declare(strict_types=1);

namespace Application\Service;

use Application\Model\Account;
use Application\Model\Booking;
use Application\Model\Transaction;
use Application\Model\TransactionLine;
use Application\Model\User;
use Cake\Chronos\Date;
use Doctrine\ORM\EntityManager;

/**
 * Service to create transactions for non-free booking, if needed, for all users or one user
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

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function invoice(?User $user = null): int
    {
        error_log('invoice', 0);

        $this->count = 0;
        $bookings = $this->entityManager->getRepository(Booking::class)->getAllToInvoice($user);

        $user = null;
        $bookingPerUser = [];

        /** @var Booking $booking */
        foreach ($bookings as $booking) {
            if ($user !== $booking->getOwner()) {
                $this->createTransaction($user, $bookingPerUser);

                $user = $booking->getOwner();
                $bookingPerUser = [];
            }

            $bookingPerUser[] = $booking;
        }
        $this->createTransaction($user, $bookingPerUser);

        return $this->count;
    }

    /**
     * @param null|User $user
     * @param Booking[] $bookings
     */
    private function createTransaction(?User $user, array $bookings): void
    {
        if (!$user || !$bookings) {
            return;
        }

        $account = $this->entityManager->getRepository(Account::class)->getOrCreate($user);
        $transaction = new Transaction();
        $transaction->setTransactionDate(Date::today());
        $transaction->setName('Cotisation et services ' . Date::today()->format('Y'));
        $this->entityManager->persist($transaction);

        foreach ($bookings as $booking) {
            $bookable = $booking->getBookable();
            $transactionLine = new TransactionLine();
            $this->entityManager->persist($transactionLine);

            $transactionLine->setName('Paiement depuis crédit MyIchtus');
            $transactionLine->setBookable($bookable);
            $transactionLine->setDebit($account);
            $transactionLine->setCredit($bookable->getCreditAccount());
            $transactionLine->setBalance($this->calculateBalance($booking));
            $transactionLine->setTransaction($transaction);
            $transactionLine->setTransactionDate(Date::today());
        }

        ++$this->count;
    }

    /**
     * @param Booking $booking
     *
     * @return string
     */
    private function calculateBalance(Booking $booking): string
    {
        $bookable = $booking->getBookable();

        $price = (string) bcadd($bookable->getPeriodicPrice(), $bookable->getInitialPrice());

        return $price;
    }
}
