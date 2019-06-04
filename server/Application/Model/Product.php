<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasAutomaticQuantity;
use Application\Traits\HasCode;
use Application\Traits\HasDescription;
use Application\Traits\HasName;
use Application\Traits\HasRemarks;
use Application\Traits\HasUnit;
use Application\Traits\HasVatRate;
use Cake\Chronos\Date;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Money\Money;

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
    use HasAutomaticQuantity;
    use HasVatRate;

    /**
     * @var Money
     *
     * @ORM\Column(type="Money", options={"default" = "0.00"})
     */
    private $pricePerUnit;

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
     * @var Money
     *
     * @ORM\Column(type="Money", options={"default" = 0, "unsigned" = true})
     */
    private $supplierPrice;

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
     * @var bool
     *
     * @ORM\Column(type="boolean", options={"default" = 0})
     */
    private $ponderatePrice = true;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->pricePerUnit = Money::CHF(0);
        $this->supplierPrice = Money::CHF(0);
        $this->productTags = new ArrayCollection();
    }

    /**
     * @return Money
     */
    public function getPricePerUnit(): Money
    {
        return $this->pricePerUnit;
    }

    /**
     * @param Money $pricePerUnit
     */
    public function setPricePerUnit(Money $pricePerUnit): void
    {
        $this->pricePerUnit = $pricePerUnit;
    }

    /**
     * @return Money
     */
    public function getSupplierPrice(): Money
    {
        return $this->supplierPrice;
    }

    /**
     * @param Money $supplierPrice
     */
    public function setSupplierPrice(Money $supplierPrice): void
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
     * Whether this product can be bought
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->isActive;
    }

    /**
     * Whether this product can be bought
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

    /**
     * Wherever product allow user defined price ponderation
     *
     * @return bool
     */
    public function getPonderatePrice(): bool
    {
        return $this->ponderatePrice;
    }

    /**
     * Wherever product allow user defined price ponderation
     *
     * @param bool $ponderatePrice
     */
    public function setPonderatePrice(bool $ponderatePrice): void
    {
        $this->ponderatePrice = $ponderatePrice;
    }
}
