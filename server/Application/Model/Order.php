<?php

declare(strict_types=1);

namespace Application\Model;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * An accounting journal entry (simple or compound)
 *
 * @ORM\Table(name="`order`")
 * @ORM\Entity(repositoryClass="Application\Repository\OrderRepository")
 * @ORM\Table(name="`order`")
 */
class Order extends AbstractModel
{
    /**
     * @var Transaction
     * @ORM\OneToOne(targetEntity="Transaction")
     */
    private $transaction;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="OrderLine", mappedBy="order")
     */
    private $orderLines;

    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=10, scale=7, options={"unsigned" = true, "default" = "0.0000000"})
     */
    private $vatPart = '0';

    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=10, scale=2, options={"unsigned" = true})
     */
    private $balance;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->orderLines = new ArrayCollection();
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
     * Get total amount of VAT
     *
     * Read only, computed by SQL triggers
     *
     * @return string
     */
    public function getVatPart(): string
    {
        return $this->vatPart;
    }

    /**
     * Get total order amount, VAT inclusive
     *
     * Read only, computed by SQL triggers
     *
     * @return string
     */
    public function getBalance(): string
    {
        return $this->balance;
    }
}