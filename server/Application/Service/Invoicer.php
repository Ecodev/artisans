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

    /**
     * @var int
     */
    private $count = 0;

    /**
     * @var bool
     */
    private $sendEmailNow = false;

    public function __construct(EntityManager $entityManager, Mailer $mailer)
    {
        $this->entityManager = $entityManager;
        $this->mailer = $mailer;
    }

    public function invoice(?User $user = null): int
    {
        $this->sendEmailNow = (bool) $user;
        $this->count = 0;
        $bookings = $this->entityManager->getRepository(Booking::class)->getAllToInvoice($user);

        $user = null;
        $bookingPerUser = [];

        /** @var Booking $booking */
        foreach ($bookings as $booking) {
            if ($user !== $booking->getOwner()) {
                $this->invoiceOne($user, $bookingPerUser);

                $user = $booking->getOwner();
                $bookingPerUser = [];
            }

            $bookingPerUser[] = $booking;
        }
        $this->invoiceOne($user, $bookingPerUser);

        return $this->count;
    }

    /**
     * @param User $user
     * @param Booking[] $bookings
     *
     * @return Transaction
     */
    private function createTransaction(User $user, array $bookings): Transaction
    {
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

        return $transaction;
    }

    /**
     * @param Booking $booking
     *
     * @return string
     */
    private function calculateBalance(Booking $booking): string
    {
        $bookable = $booking->getBookable();
        $simultaneous = $bookable->getSimultaneousBookingMaximum();

        // If infinite booking, pay full price
        if (!($simultaneous > 1)) {
            $simultaneous = 1;
        }

        $price = (string) ($bookable->getPeriodicPrice() / $simultaneous);

        return $price;
    }

    /**
     * @param null|User $user
     * @param Booking[] $bookings
     */
    private function invoiceOne(?User $user, array $bookings): void
    {
        if (!$user || !$bookings) {
            return;
        }

        $transaction = $this->createTransaction($user, $bookings);
        $this->entityManager->flush();
        $this->entityManager->refresh($user->getAccount());

        if ($user->getEmail()) {
            $message = $this->mailer->queueInvoice($user, $transaction);
            $this->entityManager->flush();

            if ($this->sendEmailNow) {
                $this->mailer->sendMessageAsync($message);
            }
        } else {
            _log()->err('Cannot notify invoice for user without email', ['user' => $user->getId(), 'transaction' => $transaction->getId()]);
        }

        ++$this->count;
    }
}
