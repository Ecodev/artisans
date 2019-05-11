<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasBalance;
use Application\Traits\HasName;
use Application\Traits\HasQuantity;
use Application\Traits\HasUnit;
use Application\Traits\HasVatRate;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * A single line in the shopping basket when making an order
 *
 * @ORM\Entity(repositoryClass="Application\Repository\OrderLineRepository")
 */
class OrderLine extends AbstractModel
{
    use HasName;
    use HasUnit;
    use HasQuantity;
    use HasBalance;
    use HasVatRate;

    /**
     * @var Order
     *
     * @ORM\ManyToOne(targetEntity="Order", inversedBy="orderLines")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
     * })
     */
    private $order;

    /**
     * @var null|Product
     *
     * @ORM\ManyToOne(targetEntity="Product")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=true, onDelete="SET NULL")
     * })
     */
    private $product;

    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=10, scale=7, options={"unsigned" = true, "default" = "0.0000000"})
     */
    private $vatPart = '0';

    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=4, scale=2, options={"unsigned" = true})
     */
    private $pricePonderation;

    /**
     * @API\Exclude
     *
     * @param Order $order
     */
    public function setOrder(Order $order): void
    {
        if ($this->order) {
            $this->order->orderLineRemoved($this);
        }

        $this->order = $order;
        $order->orderLineAdded($this);
    }

    /**
     * @return Order
     */
    public function getOrder(): Order
    {
        return $this->order;
    }

    /**
     * Get related product
     *
     * @return null|Product
     */
    public function getProduct(): ?Product
    {
        return $this->product;
    }

    /**
     * Set related product
     *
     * @param null|Product $product
     */
    public function setProduct(?Product $product): void
    {
        $this->product = $product;
    }

    /**
     * Get amount of VAT
     *
     * No setter, computed by SQL triggers
     *
     * @return string
     */
    public function getVatPart(): string
    {
        return $this->vatPart;
    }

    /**
     * Set price ratio ponderation
     *
     * @param string $pricePonderation
     */
    public function setPricePonderation(string $pricePonderation): void
    {
        $this->pricePonderation = $pricePonderation;
    }

    /**
     * @return string
     */
    public function getPricePonderation(): string
    {
        return $this->pricePonderation;
    }
}
