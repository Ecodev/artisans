<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasBalance;
use Application\Traits\HasName;
use Application\Traits\HasProductType;
use Application\Traits\HasQuantity;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * A single line in the shopping cart when making an order
 *
 * @ORM\Entity(repositoryClass="Application\Repository\OrderLineRepository")
 */
class OrderLine extends AbstractModel
{
    use HasName;
    use HasQuantity;
    use HasBalance;
    use HasProductType;

    /**
     * Additional emails for subscription for a company
     *
     * @var string[]
     * @ORM\Column(type="json", options={"default" = "[]"})
     */
    private $additionalEmails = [];

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
     * @var null|Subscription
     *
     * @ORM\ManyToOne(targetEntity="Subscription")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=true, onDelete="SET NULL")
     * })
     */
    private $subscription;

    /**
     * Constructor
     */
    public function __construct()
    {
    }

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
     * Get related product, if it still exists in DB
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
     * @param Product $product
     */
    public function setProduct(Product $product): void
    {
        $this->subscription = null;
        $this->product = $product;
        $this->setName($product->getName());
    }

    /**
     * Get related subscription, if it still exists in DB
     *
     * @return null|Subscription
     */
    public function getSubscription(): ?Subscription
    {
        return $this->subscription;
    }

    /**
     * Set related subscription
     *
     * @param Subscription $subscription
     */
    public function setSubscription(Subscription $subscription): void
    {
        $this->product = null;
        $this->subscription = $subscription;
        $this->setName($subscription->getName());
    }

    /**
     * Additional emails for subscription for a company
     *
     * @return string[]
     */
    public function getAdditionalEmails(): array
    {
        return $this->additionalEmails;
    }

    /**
     * Additional emails for subscription for a company
     *
     * @param string[] $additionalEmails
     */
    public function setAdditionalEmails(array $additionalEmails): void
    {
        $this->additionalEmails = $additionalEmails;
    }
}
