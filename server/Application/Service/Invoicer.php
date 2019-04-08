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

    /**
     * @var int
     */
    private $count = 0;

    public function __construct(EntityManager $entityManager, Mailer $mailer)
    {
        $this->entityManager = $entityManager;
        $this->mailer = $mailer;
    }

    public function invoice(): int
    {
        $this->count = 0;
        $bookings = $this->entityManager->getRepository(Booking::class)->getAllToInvoice();

        $user = null;
        $bookables = [];

        /** @var Booking $booking */
        foreach ($bookings as $booking) {
            if ($user !== $booking->getOwner()) {
                $this->invoiceOne($user, $bookables);

                $user = $booking->getOwner();
                $bookables = [];
            }

            $bookables[] = $booking->getBookable();
        }
        $this->invoiceOne($user, $bookables);

        return $this->count;
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
        $transaction->setTransactionDate(Date::today());
        $transaction->setName('Cotisation et services ' . Date::today()->format('Y'));
        $this->entityManager->persist($transaction);

        foreach ($bookables as $bookable) {
            $transactionLine = new TransactionLine();
            $this->entityManager->persist($transactionLine);

            $transactionLine->setName('Paiement depuis crédit MyIchtus');
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

    /**
     * @param null|User $user
     * @param Bookable[] $bookables
     */
    private function invoiceOne(?User $user, array $bookables): void
    {
        if (!$user || !$bookables) {
            return;
        }

        $transaction = $this->createTransaction($user, $bookables);
        $this->entityManager->flush();
        $this->entityManager->refresh($user->getAccount());

        if ($user->getEmail()) {
            $this->mailer->queueInvoice($user, $transaction);
            $this->entityManager->flush();
        } else {
            _log()->err('Cannot notify invoice for user without email', ['user' => $user->getId(), 'transaction' => $transaction->getId()]);
        }

        ++$this->count;
    }
}
