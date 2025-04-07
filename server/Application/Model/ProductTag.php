<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\ProductTagRepository;
use Application\Traits\HasColor;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;

/**
 * A type of product.
 */
#[ORM\UniqueConstraint(name: 'unique_name', columns: ['name'])]
#[ORM\Entity(ProductTagRepository::class)]
class ProductTag extends AbstractModel
{
    use HasColor;
    use HasName;

    /**
     * @var Collection<int, Product>
     */
    #[ORM\ManyToMany(targetEntity: Product::class, inversedBy: 'productTags')]
    private Collection $products;

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
