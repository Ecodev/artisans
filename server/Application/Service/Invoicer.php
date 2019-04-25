<?php

declare(strict_types=1);

namespace Application\Service;

use Application\Model\Account;
use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\Product;
use Application\Model\Transaction;
use Application\Model\TransactionLine;
use Application\Model\User;
use Application\Repository\AccountRepository;
use Cake\Chronos\Date;
use Doctrine\ORM\EntityManager;

/**
 * Service to create order and transactions for products and their quantity
 */
class Invoicer
{
    /**
     * @var EntityManager
     */
    private $entityManager;

    /**
     * @var AccountRepository
     */
    private $accountRepository;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->accountRepository = $this->entityManager->getRepository(Account::class);
    }

    public function createOrder(User $user, array $lines): ?Order
    {
        if (!$lines) {
            return null;
        }

        $this->accountRepository->getAclFilter()->setEnabled(false);
        $account = $this->accountRepository->getOrCreate($user);

        $transaction = new Transaction();
        $transaction->setTransactionDate(Date::today());
        $transaction->setName('Commissions');
        $this->entityManager->persist($transaction);

        $order = new Order();
        $order->setTransaction($transaction);
        $this->entityManager->persist($order);

        $total = '0';
        foreach ($lines as $line) {
            /** @var Product $product */
            $product = $line['product']->getEntity();
            $quantity = $line['quantity'];

            $balance = bcmul($product->getPricePerUnit(), $quantity);
            $total = bcadd($total, $balance);

            $this->createOrderLine($order, $product, $balance, $quantity);
        }

        $this->createTransactionLine($transaction, $account, $total);

        $this->accountRepository->getAclFilter()->setEnabled(true);

        return $order;
    }

    private function createTransactionLine(Transaction $transaction, Account $account, string $balance): void
    {
        $saleAccount = $this->entityManager->getReference(Account::class, AccountRepository::ACCOUNT_ID_FOR_SALE);

        if ($balance > 0) {
            $debit = $account;
            $credit = $saleAccount;
        } elseif ($balance < 0) {
            $debit = $saleAccount;
            $credit = $account;
            $balance = bcmul($balance, '-1'); // into positive
        } else {
            // Never create a line with 0 balance
            return;
        }

        $transactionLine = new TransactionLine();
        $this->entityManager->persist($transactionLine);

        $transactionLine->setName($transaction->getName());
        $transactionLine->setDebit($debit);
        $transactionLine->setCredit($credit);
        $transactionLine->setBalance($balance);
        $transactionLine->setTransaction($transaction);
        $transactionLine->setTransactionDate(Date::today());
    }

    private function createOrderLine(Order $order, Product $product, string $balance, string $quantity): OrderLine
    {
        $orderLine = new OrderLine();
        $this->entityManager->persist($orderLine);

        $orderLine->setOrder($order);
        $orderLine->setProduct($product);
        $orderLine->setName($product->getName());
        $orderLine->setUnit($product->getUnit());
        $orderLine->setQuantity($quantity);
        $orderLine->setBalance($balance);
        $orderLine->setVatRate($product->getVatRate());

        return $orderLine;
    }
}
