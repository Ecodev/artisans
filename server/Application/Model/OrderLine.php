<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasBalance;
use Application\Traits\HasProductType;
use Application\Traits\HasQuantity;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;
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
     */
    public function setOrder(Order $order): void
    {
        if ($this->order) {
            $this->order->orderLineRemoved($this);
        }

        $this->order = $order;
        $order->orderLineAdded($this);
    }

    public function getOrder(): Order
    {
        return $this->order;
    }

    /**
     * Get related product, if it still exists in DB
     */
    public function getProduct(): ?Product
    {
        return $this->product;
    }

    /**
     * Set related product
     */
    public function setProduct(?Product $product): void
    {
        $this->product = $product;
        if ($product) {
            $this->subscription = null;
            $this->setName($product->getName());
        }
    }

    /**
     * Get related subscription, if it still exists in DB
     */
    public function getSubscription(): ?Subscription
    {
        return $this->subscription;
    }

    /**
     * Set related subscription
     */
    public function setSubscription(?Subscription $subscription): void
    {
        $this->subscription = $subscription;

        if ($subscription) {
            $this->product = null;
            $this->setName($subscription->getName());
        }
    }

    public function setDonation(): void
    {
        $this->product = null;
        $this->subscription = null;
        $this->setName('Don');
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
