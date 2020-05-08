<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasAutomaticBalance;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasInternalRemarks;
use GraphQL\Doctrine\Annotation as API;
use Money\Money;

/**
 * An order made by a users
 *
 * @ORM\Entity(repositoryClass="Application\Repository\OrderRepository")
 * @ORM\Table(name="`order`")
 */
class Order extends AbstractModel
{
    const STATUS_PENDING = 'pending';
    const STATUS_VALIDATED = 'validated';

    use HasAutomaticBalance;
    use HasInternalRemarks;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="OrderLine", mappedBy="order")
     */
    private $orderLines;

    /**
     * @var string
     * @ORM\Column(type="OrderStatus", options={"default" = Order::STATUS_PENDING})
     */
    private $status = self::STATUS_PENDING;

    /**
     * @var string
     * @ORM\Column(type="PaymentMethod")
     */
    private $paymentMethod;

    /**
     * Constructor
     *
     * @param string $status status for new order
     */
    public function __construct(string $status = self::STATUS_PENDING)
    {
        $this->status = $status;
        $this->orderLines = new ArrayCollection();
        $this->balanceCHF = Money::CHF(0);
        $this->balanceEUR = Money::EUR(0);
    }

    /**
     * Notify when a order line is added
     * This should only be called by OrderLine::setOrder()
     *
     * @param OrderLine $orderLine
     */
    public function orderLineAdded(OrderLine $orderLine): void
    {
        $this->orderLines->add($orderLine);
    }

    /**
     * Notify when a order line is removed
     * This should only be called by OrderLine::setOrder()
     *
     * @param OrderLine $orderLine
     */
    public function orderLineRemoved(OrderLine $orderLine): void
    {
        $this->orderLines->removeElement($orderLine);
    }

    /**
     * @return Collection
     */
    public function getOrderLines(): Collection
    {
        return $this->orderLines;
    }

    /**
     * @API\Field(type="OrderStatus")
     */
    public function getStatus(): string
    {
        return $this->status;
    }

    /**
     * @API\Input(type="OrderStatusType")
     *
     * @param string $status
     */
    public function setStatus(string $status): void
    {
        $this->status = $status;
    }

    /**
     * @API\Field(type="PaymentMethod")
     *
     * @return string
     */
    public function getPaymentMethod(): string
    {
        return $this->paymentMethod;
    }

    /**
     * @API\Input(type="PaymentMethod")
     *
     * @param string $paymentMethod
     */
    public function setPaymentMethod(string $paymentMethod): void
    {
        $this->paymentMethod = $paymentMethod;
    }
}
