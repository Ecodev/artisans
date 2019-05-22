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

        $this->accountRepository->getAclFilter()->setEnabled(false);
        $account = $this->accountRepository->getOrCreate($user);

        $transaction = new Transaction();
        $transaction->setTransactionDate(Chronos::now());
        $transaction->setName('Vente');
        $this->entityManager->persist($transaction);

        $order = new Order();
        $order->setTransaction($transaction);
        $this->entityManager->persist($order);

        $total = Money::CHF(0);
        foreach ($lines as $line) {
            /** @var Product $product */
            $product = $line['product'];
            $quantity = $line['quantity'];
            $pricePonderation = $line['pricePonderation'];

            $balance = $product->getPricePerUnit()->multiply($quantity)->multiply($pricePonderation);
            $total = $total->add($balance);

            $this->createOrderLine($order, $product, $balance, $quantity, $pricePonderation);
        }

        $this->createTransactionLine($transaction, $account, $total);

        $this->accountRepository->getAclFilter()->setEnabled(true);

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

    private function createOrderLine(Order $order, Product $product, Money $balance, string $quantity, string $pricePonderation): OrderLine
    {
        $orderLine = new OrderLine();
        $this->entityManager->persist($orderLine);

        $orderLine->setOrder($order);
        $orderLine->setProduct($product);
        $orderLine->setName($product->getName());
        $orderLine->setUnit($product->getUnit());
        $orderLine->setQuantity($quantity);
        $orderLine->setBalance($balance);
        $orderLine->setPricePonderation($pricePonderation);
        $orderLine->setVatRate($product->getVatRate());

        $this->createStockMovement($orderLine);

        return $orderLine;
    }

    private function createStockMovement(OrderLine $orderLine): void
    {
        $stockMovement = new StockMovement();
        $this->entityManager->persist($stockMovement);

        $stockMovement->setProduct($orderLine->getProduct());
        $stockMovement->setOrderLine($orderLine);
        $stockMovement->setDelta(bcmul($orderLine->getQuantity(), '-1', 3));
        $stockMovement->setType(StockMovementTypeType::SALE);
    }
}
