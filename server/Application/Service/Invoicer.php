<?php

declare(strict_types=1);

namespace Application\Service;

use Application\Enum\ProductType;
use Application\Model\AbstractProduct;
use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\Product;
use Application\Model\Subscription;
use Application\Model\User;
use Application\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use Ecodev\Felix\Api\Exception;
use Money\Money;

/**
 * Service to create order and transactions for products and their quantity.
 */
class Invoicer
{
    private readonly UserRepository $userRepository;

    public function __construct(
        private readonly EntityManager $entityManager,
    ) {
        $this->userRepository = $this->entityManager->getRepository(User::class);
    }

    public function createOrder(array $orderInput): ?Order
    {
        $lines = $orderInput['orderLines'];
        if (!$lines) {
            return null;
        }

        $order = new Order();
        $order->setPaymentMethod($orderInput['paymentMethod']);
        $order->setFirstName($orderInput['firstName'] ?? '');
        $order->setLastName($orderInput['lastName'] ?? '');
        $order->setStreet($orderInput['street'] ?? '');
        $order->setLocality($orderInput['locality'] ?? '');
        $order->setPostcode($orderInput['postcode'] ?? '');
        $order->setCountry($orderInput['country'] ?? null);

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

    private function createOrderLine(Order $order, ?AbstractProduct $product, Money $pricePerUnit, int $quantity, bool $isCHF, ProductType $type, array $additionalEmails): OrderLine
    {
        $orderLine = new OrderLine();
        $this->entityManager->persist($orderLine);
        $orderLine->setOrder($order);

        $this->updateOrderLine($orderLine, $product, $pricePerUnit, $quantity, $isCHF, $type, $additionalEmails);

        return $orderLine;
    }

    private function extractArgsFromLine($input): array
    {
        $product = $input['product'] ?? null;
        $subscription = $input['subscription'] ?? null;
        $quantity = $input['quantity'];
        $isCHF = $input['isCHF'];
        $type = $input['type'];
        $additionalEmails = $input['additionalEmails'];
        $pricePerUnit = $input['pricePerUnit'] ?? null;
        $this->assertExactlyOneNotNull($product, $subscription, $pricePerUnit);

        $abstractProduct = $product ?? $subscription;
        $pricePerUnit = $this->getPricePerUnit($abstractProduct, $pricePerUnit, $isCHF);

        if ($additionalEmails && !$subscription) {
            throw new Exception('Cannot submit additionalEmails without a subscription');
        }

        if ($additionalEmails && !$subscription->isPro()) {
            throw new Exception('Cannot submit additionalEmails with a subscription that is not pro');
        }

        // User cannot choose type of a subscription
        if ($subscription) {
            $type = $subscription->getType();
        }

        return [
            $abstractProduct,
            $pricePerUnit,
            $quantity,
            $isCHF,
            $type,
            $additionalEmails,
        ];
    }

    private function assertExactlyOneNotNull(...$args): void
    {
        $onlyNotNull = array_filter($args, fn ($val) => $val !== null);

        if (count($onlyNotNull) !== 1) {
            throw new Exception('Must have a product, or a subscription, or a pricePerUnit. And not a mixed of those.');
        }
    }

    public function updateOrderLineAndTransactionLine(OrderLine $orderLine, array $line): void
    {
        $this->userRepository->getAclFilter()->runWithoutAcl(function () use ($orderLine, $line): void {
            $args = $this->extractArgsFromLine($line);
            $this->updateOrderLine($orderLine, ...$args);
        });
    }

    private function updateOrderLine(OrderLine $orderLine, ?AbstractProduct $product, Money $pricePerUnit, int $quantity, bool $isCHF, ProductType $type, array $additionalEmails): void
    {
        if ($isCHF) {
            $balanceCHF = $pricePerUnit->multiply($quantity);
            $balanceEUR = Money::EUR(0);
        } else {
            $balanceCHF = Money::CHF(0);
            $balanceEUR = $pricePerUnit->multiply($quantity);
        }

        if (!$product) {
            $orderLine->setDonation();
        } elseif ($product instanceof Product) {
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

    private function getPricePerUnit(?AbstractProduct $product, ?Money $pricePerUnit, bool $isCHF): Money
    {
        if ($product && $isCHF) {
            return $product->getPricePerUnitCHF();
        }

        if ($product) {
            return $product->getPricePerUnitEUR();
        }

        if ($pricePerUnit === null || !$pricePerUnit->isPositive()) {
            throw new Exception('A donation must have strictly positive price');
        }

        // The API always assume CHF, but if the client specifically say it is EUR, we need to convert
        if (!$isCHF) {
            return Money::EUR($pricePerUnit->getAmount());
        }

        return $pricePerUnit;
    }
}
