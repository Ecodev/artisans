<?php

declare(strict_types=1);

namespace Application\Service;

use Application\Model\Account;
use Application\Model\Bookable;
use Application\Model\Booking;
use Application\Model\Transaction;
use Application\Model\TransactionLine;
use Application\Model\User;
use Cake\Chronos\Date;
use Doctrine\ORM\EntityManager;

class Invoicer
{
    /**
     * @var EntityManager
     */
    private $entityManager;

    /**
     * @var Mailer
     */
    private $mailer;

    public function __construct(EntityManager $entityManager, Mailer $mailer)
    {
        $this->entityManager = $entityManager;
        $this->mailer = $mailer;
    }

    public function invoice(): void
    {
        $bookings = $this->entityManager->getRepository(Booking::class)->getAllToInvoice();
        $user = null;
        $bookables = [];

        /** @var Booking $booking */
        foreach ($bookings as $booking) {
            if ($user !== $booking->getOwner()) {
                if ($user) {
                    $transaction = $this->createTransaction($user, $bookables);

                    $this->entityManager->flush();
                    $this->entityManager->refresh($user->getAccount());

                    if ($user->getEmail()) {
                        $this->mailer->queueInvoice($user, $transaction);
                    }
                }

                $user = $booking->getOwner();
                $bookables = [];
            }

            $bookables[] = $booking->getBookable();
        }
    }

    /**
     * @param User $user
     * @param Bookable[] $bookables
     *
     * @return Transaction
     */
    private function createTransaction(User $user, array $bookables): Transaction
    {
        $account = $this->entityManager->getRepository(Account::class)->getOrCreate($user);
        $transaction = new Transaction();
        $this->entityManager->persist($transaction);

        foreach ($bookables as $bookable) {
            $transactionLine = new TransactionLine();
            $this->entityManager->persist($transactionLine);

            $transactionLine->setBookable($bookable);
            $transactionLine->setDebit($account);
            $transactionLine->setCredit($bookable->getCreditAccount());
            $transactionLine->setBalance($this->calculateBalance($bookable));
            $transactionLine->setTransaction($transaction);
            $transactionLine->setTransactionDate(Date::today());
        }

        return $transaction;
    }

    /**
     * @param Bookable $bookable
     *
     * @return string
     */
    private function calculateBalance(Bookable $bookable): string
    {
        $simultaneous = $bookable->getSimultaneousBookingMaximum();

        // If infinite booking, pay full price
        if (!($simultaneous > 1)) {
            $simultaneous = 1;
        }

        $price = (string) ($bookable->getPeriodicPrice() / $simultaneous);

        return $price;
    }
}
