<?php

declare(strict_types=1);

namespace Application\Model;

use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * Stock movements provides a log of all the stock changes for a given product.
 *
 * It may also be related to an order if applicable.
 *
 * @ORM\Entity(repositoryClass="Application\Repository\StockMovementRepository")
 */
class StockMovement extends AbstractModel
{
    /**
     * @var string
     *
     * @ORM\Column(type="StockMovementType")
     */
    private $type;

    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=10, scale=3, options={"default" = "0.00"})
     */
    private $quantity = '0';

    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=10, scale=3, options={"default" = "0.00"})
     */
    private $delta = '0';

    /**
     * @var null|OrderLine
     *
     * @ORM\OneToOne(targetEntity="OrderLine")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="SET NULL")
     * })
     */
    private $orderLine;

    /**
     * @var Product
     *
     * @ORM\ManyToOne(targetEntity="Product")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
     * })
     */
    private $product;

    /**
     * Quantity in stock after the movement happened
     *
     * This exists only for convenience to do stats
     *
     * @return string
     */
    public function getQuantity(): string
    {
        return $this->quantity;
    }

    /**
     * Delta of stock from previous quantity
     *
     * @return string
     */
    public function getDelta(): string
    {
        return $this->delta;
    }

    /**
     * Delta of stock from previous quantity
     *
     * @param string $delta
     */
    public function setDelta(string $delta): void
    {
        $this->applyDelta($this->delta, $delta);
        $this->delta = $delta;
    }

    /**
     * @API\Exclude
     *
     * @param null|OrderLine $orderLine
     */
    public function setOrderLine(?OrderLine $orderLine): void
    {
        $this->orderLine = $orderLine;
    }

    /**
     * @return null|OrderLine
     */
    public function getOrderLine(): ?OrderLine
    {
        return $this->orderLine;
    }

    /**
     * Get related product
     *
     * @return Product
     */
    public function getProduct(): Product
    {
        return $this->product;
    }

    /**
     * Set related product
     *
     * @API\Exclude
     *
     * @param Product $product
     */
    public function setProduct(Product $product): void
    {
        $this->product = $product;
        $this->applyDelta('0', $this->delta);
    }

    /**
     * @param string $oldDelta
     * @param string $newDelta
     */
    private function applyDelta(string $oldDelta, string $newDelta): void
    {
        if ($this->product) {
            $this->quantity = bcadd(bcsub($this->getProduct()->getQuantity(), $oldDelta, 3), $newDelta, 3);
            $this->getProduct()->setQuantity($this->quantity);
        }
    }

    /**
     * Get type
     *
     * @API\Field(type="StockMovementType")
     *
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * Set type
     *
     * @API\Input(type="StockMovementType")
     *
     * @param string $type
     */
    public function setType(string $type): void
    {
        $this->type = $type;
    }
}
