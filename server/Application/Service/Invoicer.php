<?php

declare(strict_types=1);

namespace Application\Service;

use Application\Model\AbstractProduct;
use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\Product;
use Application\Model\Subscription;
use Application\Model\User;
use Application\Repository\UserRepository;
use Application\Utility;
use Doctrine\ORM\EntityManager;
use Exception;
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
                $args = $this->extractArgsFromLine($line);

                $orderLine = $this->createOrderLine($order, ...$args);
                $total = $total->add($orderLine->getBalanceCHF());
            }
        });

        return $order;
    }

    private function createOrderLine(Order $order, AbstractProduct $product, string $quantity, bool $isCHF, string $type, array $additionalEmails): OrderLine
    {
        $orderLine = new OrderLine();
        $this->entityManager->persist($orderLine);
        $orderLine->setOrder($order);

        $this->updateOrderLine($orderLine, $product, $quantity, $isCHF, $type, $additionalEmails);

        return $orderLine;
    }

    private function extractArgsFromLine($line): array
    {
        $input = Utility::entityIdToModel($line);
        $product = $input['product'] ?? null;
        $subscription = $input['subscription'] ?? null;
        $quantity = $input['quantity'];
        $isCHF = $input['isCHF'];
        $type = $input['type'];
        $additionalEmails = $input['additionalEmails'];

        if ($product && $subscription) {
            throw new Exception('Cannot have both a product and a subscription');
        }

        if (!$product && !$subscription) {
            throw new Exception('Must have either a product or a subscription');
        }

        return [
            $product ?? $subscription,
            $quantity,
            $isCHF,
            $type,
            $additionalEmails,
        ];
    }

    public function updateOrderLineAndTransactionLine(OrderLine $orderLine, array $line): void
    {
        $this->userRepository->getAclFilter()->runWithoutAcl(function () use ($orderLine, $line): void {
            $args = $this->extractArgsFromLine($line);
            $this->updateOrderLine($orderLine, ...$args);
        });
    }

    private function updateOrderLine(OrderLine $orderLine, AbstractProduct $product, string $quantity, bool $isCHF, string $type, array $additionalEmails): void
    {
        if ($isCHF) {
            $balanceCHF = $product->getPricePerUnitCHF()->multiply($quantity);
            $balanceEUR = Money::EUR(0);
        } else {
            $balanceCHF = Money::CHF(0);
            $balanceEUR = $product->getPricePerUnitEUR()->multiply($quantity);
        }

        if ($product instanceof Product) {
            $orderLine->setProduct($product);
        } elseif ($product instanceof Subscription) {
            $orderLine->setSubscription($product);
        } else {
            throw new Exception('Unsupported subclass of product');
        }

        $orderLine->setIsCHF($isCHF);
        $orderLine->setType($type);
        $orderLine->setQuantity($quantity);
        $orderLine->setBalanceCHF($balanceCHF);
        $orderLine->setBalanceEUR($balanceEUR);
        $orderLine->setAdditionalEmails($additionalEmails);
    }

    private function selectAbstractProduct(?Product $product, ?Subscription $subscription): AbstractProduct
    {
        if ($product && $subscription) {
            throw new Exception('Cannot have both a product and a subscription');
        }

        if ($product) {
            return $product;
        }

        if ($subscription) {
            return $subscription;
        }

        throw new Exception('Must have either a product or a subscription');
    }
}
