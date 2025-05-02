<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Enum\OrderStatus;
use Application\Enum\PaymentMethod;
use Application\Repository\OrderRepository;
use Application\Traits\HasAddress;
use Application\Traits\HasAutomaticBalance;
use Application\Traits\HasBalanceInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasInternalRemarks;
use GraphQL\Doctrine\Attribute as API;
use Money\Money;

/**
 * An order made by a users.
 */
#[ORM\Table('`order`')]
#[ORM\Entity(OrderRepository::class)]
class Order extends AbstractModel implements HasBalanceInterface
{
    use HasAddress;
    use HasAutomaticBalance;
    use HasInternalRemarks;

    #[ORM\Column(type: 'enum', options: ['default' => OrderStatus::Pending])]
    private OrderStatus $status = OrderStatus::Pending;

    /**
     * @var Collection<int, OrderLine>
     */
    #[ORM\OneToMany(targetEntity: OrderLine::class, mappedBy: 'order')]
    private Collection $orderLines;

    #[ORM\Column(type: 'enum')]
    private PaymentMethod $paymentMethod;

    /**
     * @param OrderStatus $status status for new order
     */
    public function __construct(OrderStatus $status = OrderStatus::Pending)
    {
        $this->status = $status;
        $this->orderLines = new ArrayCollection();
        $this->balanceCHF = Money::CHF(0);
        $this->balanceEUR = Money::EUR(0);
    }

    /**
     * Notify when a order line is added
     * This should only be called by OrderLine::setOrder().
     */
    public function orderLineAdded(OrderLine $orderLine): void
    {
        $this->orderLines->add($orderLine);
    }

    /**
     * Notify when a order line is removed
     * This should only be called by OrderLine::setOrder().
     */
    public function orderLineRemoved(OrderLine $orderLine): void
    {
        $this->orderLines->removeElement($orderLine);
    }

    public function getOrderLines(): Collection
    {
        return $this->orderLines;
    }

    public function getStatus(): OrderStatus
    {
        return $this->status;
    }

    public function setStatus(OrderStatus $status): void
    {
        // If we change from non-confirmed to confirmed, then give temporary access (until explicit import of users)
        if ($this->status !== OrderStatus::Validated && $status === OrderStatus::Validated) {
            /** @var OrderLine $orderLine */
            foreach ($this->getOrderLines() as $orderLine) {
                $orderLine->maybeGiveTemporaryAccess();
            }
        }

        $this->status = $status;
    }

    public function getPaymentMethod(): PaymentMethod
    {
        return $this->paymentMethod;
    }

    public function setPaymentMethod(PaymentMethod $paymentMethod): void
    {
        $this->paymentMethod = $paymentMethod;
    }

    /**
     * Return whether there is at least one subscription in the order.
     */
    #[API\Exclude]
    public function hasSubscription(): bool
    {
        /** @var OrderLine $line */
        foreach ($this->getOrderLines() as $line) {
            if ($line->getSubscription()) {
                return true;
            }
        }

        return false;
    }
}
