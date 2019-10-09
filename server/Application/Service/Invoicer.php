<?php

declare(strict_types=1);

namespace Application\Service;

use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\Product;
use Application\Model\User;
use Application\Repository\UserRepository;
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
     * @var UserRepository
     */
    private $userRepository;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->userRepository = $this->entityManager->getRepository(User::class);
    }

    public function createOrder(array $lines): ?Order
    {
        if (!$lines) {
            return null;
        }

        $order = new Order();

        $this->userRepository->getAclFilter()->runWithoutAcl(function () use ($lines, $order): void {
            $this->entityManager->persist($order);

            $total = Money::CHF(0);
            foreach ($lines as $line) {
                /** @var Product $product */
                $product = $line['product'];
                $quantity = $line['quantity'];
                $isCHF = $line['isCHF'];
                $type = $line['type'];

                $orderLine = $this->createOrderLine($order, $product, $quantity, $isCHF, $type);
                $total = $total->add($orderLine->getBalanceCHF());
            }
        });

        return $order;
    }

    private function createOrderLine(Order $order, Product $product, string $quantity, bool $isCHF, string $type): OrderLine
    {
        $orderLine = new OrderLine();
        $this->entityManager->persist($orderLine);
        $orderLine->setOrder($order);

        $this->updateOrderLine($orderLine, $product, $quantity, $isCHF, $type);

        return $orderLine;
    }

    public function updateOrderLineAndTransactionLine(OrderLine $orderLine, Product $product, string $quantity, bool $isCHF, string $type): void
    {
        $this->userRepository->getAclFilter()->runWithoutAcl(function () use ($orderLine, $product, $quantity, $isCHF, $type): void {
            $this->updateOrderLine($orderLine, $product, $quantity, $isCHF, $type);
        });
    }

    private function updateOrderLine(OrderLine $orderLine, Product $product, string $quantity, bool $isCHF, string $type): void
    {
        if ($isCHF) {
            $balanceCHF = $product->getPricePerUnitCHF()->multiply($quantity);
            $balanceEUR = Money::EUR(0);
        } else {
            $balanceCHF = Money::CHF(0);
            $balanceEUR = $product->getPricePerUnitEUR()->multiply($quantity);
        }

        $orderLine->setIsCHF($isCHF);
        $orderLine->setType($type);
        $orderLine->setProduct($product);
        $orderLine->setQuantity($quantity);
        $orderLine->setBalanceCHF($balanceCHF);
        $orderLine->setBalanceEUR($balanceEUR);
    }
}
