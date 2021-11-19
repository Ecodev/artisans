<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasColor;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;

/**
 * A type of product.
 *
 * @ORM\Entity(repositoryClass="\Application\Repository\ProductTagRepository")
 * @ORM\Table(uniqueConstraints={
 *     @ORM\UniqueConstraint(name="unique_name", columns={"name"})
 * })
 */
class ProductTag extends AbstractModel
{
    use HasColor;
    use HasName;

    /**
     * @var Collection<Product>
     * @ORM\ManyToMany(targetEntity="Product", inversedBy="productTags")
     */
    private $products;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->products = new ArrayCollection();
    }

    public function getProducts(): Collection
    {
        return $this->products;
    }

    /**
     * Add product.
     */
    public function addProduct(Product $product): void
    {
        if (!$this->products->contains($product)) {
            $this->products->add($product);
            $product->productTagAdded($this);
        }
    }

    /**
     * Remove product.
     */
    public function removeProduct(Product $product): void
    {
        $this->products->removeElement($product);
        $product->productTagRemoved($this);
    }
}
