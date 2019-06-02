<?php

declare(strict_types=1);

namespace Application\Service;

use Application\DBAL\Types\StockMovementTypeType;
use Application\Model\Account;
use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\Product;
use Application\Model\StockMovement;
use Application\Model\Transaction;
use Application\Model\TransactionLine;
use Application\Model\User;
use Application\Repository\AccountRepository;
use Cake\Chronos\Chronos;
use Doctrine\ORM\EntityManager;
use Money\Money;

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

        $order = new Order();

        $this->accountRepository->getAclFilter()->runWithoutAcl(function () use ($user, $lines, $order): void {
            $account = $this->accountRepository->getOrCreate($user);

            $transaction = new Transaction();
            $transaction->setTransactionDate(Chronos::now());
            $transaction->setName('Vente');
            $this->entityManager->persist($transaction);

            $order->setTransaction($transaction);
            $this->entityManager->persist($order);

            $total = Money::CHF(0);
            foreach ($lines as $line) {
                /** @var Product $product */
                $product = $line['product'];
                $quantity = $line['quantity'];
                $pricePonderation = $line['pricePonderation'];

                $orderLine = $this->createOrderLine($order, $product, $quantity, $pricePonderation);
                $total = $total->add($orderLine->getBalance());
            }

            $this->createTransactionLine($transaction, $account, $total);
        });

        return $order;
    }

    private function createTransactionLine(Transaction $transaction, Account $account, Money $balance): void
    {
        $saleAccount = $this->entityManager->getReference(Account::class, AccountRepository::ACCOUNT_ID_FOR_SALE);

        if ($balance->isPositive()) {
            $debit = $account;
            $credit = $saleAccount;
        } elseif ($balance->isNegative()) {
            $debit = $saleAccount;
            $credit = $account;
            $balance = $balance->absolute();
        } else {
            // Never create a line with 0 balance
            return;
        }

        $transactionLine = new TransactionLine();
        $this->entityManager->persist($transactionLine);

        $transactionLine->setName('Achats');
        $transactionLine->setDebit($debit);
        $transactionLine->setCredit($credit);
        $transactionLine->setBalance($balance);
        $transactionLine->setTransaction($transaction);
        $transactionLine->setTransactionDate(Chronos::now());
    }

    private function createOrderLine(Order $order, Product $product, string $quantity, string $pricePonderation): OrderLine
    {
        $orderLine = new OrderLine();
        $this->entityManager->persist($orderLine);
        $orderLine->setOrder($order);

        $stockMovement = new StockMovement();
        $this->entityManager->persist($stockMovement);
        $stockMovement->setOrderLine($orderLine);

        $this->updateOrderLine($orderLine, $product, $quantity, $pricePonderation);

        return $orderLine;
    }

    public function updateOrderLineAndTransactionLine(OrderLine $orderLine, Product $product, string $quantity, string $pricePonderation): void
    {
        $orderBefore = $orderLine->getBalance();
        $this->updateOrderLine($orderLine, $product, $quantity, $pricePonderation);
        $orderAfter = $orderLine->getBalance();

        /** @var TransactionLine $transactionLine */
        $transactionLine = $orderLine->getOrder()->getTransaction()->getTransactionLines()->first();

        $transactionBefore = $transactionLine->getBalance();
        $transactionAfter = $transactionBefore->subtract($orderBefore)->add($orderAfter);

        // Swap account if negativity changed
        if (
            ($transactionBefore->isNegative() && !$transactionAfter->isNegative())
            || (!$transactionBefore->isNegative() && $transactionAfter->isNegative())
        ) {
            $credit = $transactionLine->getCredit();
            $debit = $transactionLine->getDebit();
            $transactionLine->setCredit($debit);
            $transactionLine->setDebit($credit);
        }

        $transactionLine->setBalance($transactionAfter);
    }

    private function updateOrderLine(OrderLine $orderLine, Product $product, string $quantity, string $pricePonderation): void
    {
        $balance = $product->getPricePerUnit()->multiply($quantity)->multiply($pricePonderation);

        $orderLine->setProduct($product);
        $orderLine->setQuantity($quantity);
        $orderLine->setPricePonderation($pricePonderation);
        $orderLine->setBalance($balance);

        $stockMovement = $orderLine->getStockMovement();
        $stockMovement->setProduct($orderLine->getProduct());
        $stockMovement->setDelta(bcmul($orderLine->getQuantity(), '-1', 3));
        $stockMovement->setType(StockMovementTypeType::SALE);
    }
}
