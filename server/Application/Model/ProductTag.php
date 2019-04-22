<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasColor;
use Application\Traits\HasName;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * A type of product.
 *
 * Typical values would be: "Voilier", "SUP".
 *
 * @ORM\Entity(repositoryClass="\Application\Repository\ProductTagRepository")
 * @ORM\Table(uniqueConstraints={
 *     @ORM\UniqueConstraint(name="unique_name", columns={"name"})
 * })
 */
class ProductTag extends AbstractModel
{
    use HasName;
    use HasColor;

    /**
     * @var Collection
     * @ORM\ManyToMany(targetEntity="Product", inversedBy="productTags")
     */
    private $products;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->products = new ArrayCollection();
    }

    /**
     * @return Collection
     */
    public function getProducts(): Collection
    {
        return $this->products;
    }

    /**
     * Add product
     *
     * @param Product $product
     */
    public function addProduct(Product $product): void
    {
        if (!$this->products->contains($product)) {
            $this->products->add($product);
            $product->productTagAdded($this);
        }
    }

    /**
     * Remove product
     *
     * @param Product $product
     */
    public function removeProduct(Product $product): void
    {
        $this->products->removeElement($product);
        $product->productTagRemoved($this);
    }
}
