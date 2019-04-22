<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasName;
use Doctrine\ORM\Mapping as ORM;

/**
 * An item that can be booked by a user
 *
 * @ORM\Entity(repositoryClass="\Application\Repository\ProductMetadataRepository")
 * @ORM\Table(uniqueConstraints={
 *     @ORM\UniqueConstraint(name="unique_name", columns={"name", "product_id"})
 * })
 */
class ProductMetadata extends AbstractModel
{
    use HasName;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=191, options={"default" = ""})
     */
    private $value = '';

    /**
     * @var Product
     * @ORM\ManyToOne(targetEntity="Product")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="CASCADE")
     * })
     */
    private $product;

    /**
     * @return string
     */
    public function getValue(): string
    {
        return $this->value;
    }

    /**
     * @param string $value
     */
    public function setValue(string $value): void
    {
        $this->value = $value;
    }

    /**
     * @return Product
     */
    public function getProduct(): Product
    {
        return $this->product;
    }

    /**
     * @param Product $product
     */
    public function setProduct(Product $product): void
    {
        $this->product = $product;
    }
}
