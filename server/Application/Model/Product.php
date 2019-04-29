<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasCode;
use Application\Traits\HasDescription;
use Application\Traits\HasName;
use Application\Traits\HasQuantity;
use Application\Traits\HasRemarks;
use Application\Traits\HasUnit;
use Application\Traits\HasVatRate;
use Cake\Chronos\Date;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * An item that can be booked by a user
 *
 * @ORM\Entity(repositoryClass="\Application\Repository\ProductRepository")
 */
class Product extends AbstractModel
{
    use HasName;
    use HasDescription;
    use HasCode;
    use HasRemarks;
    use HasUnit;
    use HasQuantity;
    use HasVatRate;

    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=10, scale=2, options={"default" = "0.00"})
     */
    private $pricePerUnit = '0';

    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=10, scale=2, options={"default" = "0.20"})
     */
    private $margin = '0.20';

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=191, options={"default" = ""})
     */
    private $supplier = '';

    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=10, scale=2, options={"default" = "0.00", "unsigned" = true})
     */
    private $supplierPrice = '0';

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=20, options={"default" = ""})
     */
    private $supplierReference = '';

    /**
     * @var bool
     *
     * @ORM\Column(type="boolean", options={"default" = 1})
     */
    private $isActive = true;

    /**
     * @var null|Date
     * @ORM\Column(type="date", nullable=true)
     */
    private $verificationDate;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="ProductTag", mappedBy="products")
     */
    private $productTags;

    /**
     * @var null|Image
     * @ORM\OneToOne(targetEntity="Image", orphanRemoval=true)
     * @ORM\JoinColumn(name="image_id", referencedColumnName="id")
     */
    private $image;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->productTags = new ArrayCollection();
    }

    /**
     * @return string
     */
    public function getPricePerUnit(): string
    {
        return $this->pricePerUnit;
    }

    /**
     * @param string $pricePerUnit
     */
    public function setPricePerUnit(string $pricePerUnit): void
    {
        $this->pricePerUnit = $pricePerUnit;
    }

    /**
     * @return string
     */
    public function getSupplierPrice(): string
    {
        return $this->supplierPrice;
    }

    /**
     * @param string $supplierPrice
     */
    public function setSupplierPrice(string $supplierPrice): void
    {
        $this->supplierPrice = $supplierPrice;
    }

    /**
     * @return string
     */
    public function getSupplierReference(): string
    {
        return $this->supplierReference;
    }

    /**
     * @param string $supplierReference
     */
    public function setSupplierReference(string $supplierReference): void
    {
        $this->supplierReference = $supplierReference;
    }

    /**
     * Whether this product can be booked
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->isActive;
    }

    /**
     * Whether this product can be booked
     *
     * @param bool $isActive
     */
    public function setIsActive(bool $isActive): void
    {
        $this->isActive = $isActive;
    }

    /**
     * The date then the product was last checked
     *
     * @return null|Date
     */
    public function getVerificationDate(): ?Date
    {
        return $this->verificationDate;
    }

    /**
     * The date then the product was last checked
     *
     * @param null|Date $verificationDate
     */
    public function setVerificationDate(?Date $verificationDate): void
    {
        $this->verificationDate = $verificationDate;
    }

    /**
     * @return Collection
     */
    public function getProductTags(): Collection
    {
        return $this->productTags;
    }

    /**
     * Notify the user that it has a new productTag.
     * This should only be called by ProductTag::addUser()
     *
     * @param ProductTag $productTag
     */
    public function productTagAdded(ProductTag $productTag): void
    {
        $this->productTags->add($productTag);
    }

    /**
     * Notify the user that it a productTag was removed.
     * This should only be called by ProductTag::removeUser()
     *
     * @param ProductTag $productTag
     */
    public function productTagRemoved(ProductTag $productTag): void
    {
        $this->productTags->removeElement($productTag);
    }

    /**
     * @return null|Image
     */
    public function getImage(): ?Image
    {
        return $this->image;
    }

    /**
     * @param null|Image $image
     */
    public function setImage(?Image $image): void
    {
        // We must trigger lazy loading, otherwise Doctrine will seriously
        // mess up lifecycle callbacks and delete unrelated image on disk
        if ($this->image) {
            $this->image->getFilename();
        }

        $this->image = $image;
    }

    /**
     * Percentage of margin made on price
     *
     * @return string
     */
    public function getMargin(): string
    {
        return $this->margin;
    }

    /**
     * Percentage of margin made on price
     *
     * @param string $margin
     */
    public function setMargin(string $margin): void
    {
        $this->margin = $margin;
    }

    /**
     * Name of supplier
     *
     * @return string
     */
    public function getSupplier(): string
    {
        return $this->supplier;
    }

    /**
     * Name of supplier
     *
     * @param string $supplier
     */
    public function setSupplier(string $supplier): void
    {
        $this->supplier = $supplier;
    }
}
