<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasVatPart;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Money\Money;

/**
 * An accounting journal entry (simple or compound)
 *
 * @ORM\Entity(repositoryClass="Application\Repository\OrderRepository")
 * @ORM\Table(name="`order`")
 */
class Order extends AbstractModel
{
    use HasVatPart;

    /**
     * @var Transaction
     * @ORM\OneToOne(targetEntity="Transaction")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
     * })
     */
    private $transaction;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="OrderLine", mappedBy="order")
     */
    private $orderLines;

    /**
     * @var Money
     *
     * @ORM\Column(type="Money", nullable=true, options={"unsigned" = true})
     */
    private $balance;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->orderLines = new ArrayCollection();
        $this->vatPart = Money::CHF(0);
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
     * @return Transaction
     */
    public function getTransaction(): Transaction
    {
        return $this->transaction;
    }

    /**
     * @param Transaction $transaction
     */
    public function setTransaction(Transaction $transaction): void
    {
        $this->transaction = $transaction;
    }

    /**
     * Get total order amount, VAT inclusive
     *
     * Read only, computed by SQL triggers
     *
     * @return Money
     */
    public function getBalance(): Money
    {
        return $this->balance;
    }
}
