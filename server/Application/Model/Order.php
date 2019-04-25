<?php

declare(strict_types=1);

namespace Application\Model;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * An accounting journal entry (simple or compound)
 *
 * @ORM\Entity(repositoryClass="Application\Repository\OrderRepository")
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
}
