<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasCode;
use Application\Traits\HasDescription;
use Application\Traits\HasName;
use Application\Traits\HasRemarks;
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

    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=10, scale=2, options={"default" = "0.00"})
     */
    private $initialPrice = '0';

    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=10, scale=2, options={"default" = "0.00"})
     */
    private $periodicPrice = '0';

    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=10, scale=2, options={"default" = "0.00", "unsigned" = true})
     */
    private $purchasePrice = '0';

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
     * @var ProductTag
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
     * @var null|Account
     *
     * @ORM\ManyToOne(targetEntity="Account")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=true, onDelete="CASCADE")
     * })
     */
    private $creditAccount;

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
    public function getInitialPrice(): string
    {
        return $this->initialPrice;
    }

    /**
     * @param string $initialPrice
     */
    public function setInitialPrice(string $initialPrice): void
    {
        $this->initialPrice = $initialPrice;
    }

    /**
     * @return string
     */
    public function getPeriodicPrice(): string
    {
        return $this->periodicPrice;
    }

    /**
     * @param string $periodicPrice
     */
    public function setPeriodicPrice(string $periodicPrice): void
    {
        $this->periodicPrice = $periodicPrice;
    }

    /**
     * @return string
     */
    public function getPurchasePrice(): string
    {
        return $this->purchasePrice;
    }

    /**
     * @param string $purchasePrice
     */
    public function setPurchasePrice(string $purchasePrice): void
    {
        $this->purchasePrice = $purchasePrice;
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
     * The account to credit when buying this product
     *
     * @return null|Account
     */
    public function getCreditAccount(): ?Account
    {
        return $this->creditAccount;
    }

    /**
     * The account to credit when buying this product
     *
     * @param null|Account $creditAccount
     */
    public function setCreditAccount(?Account $creditAccount): void
    {
        $this->creditAccount = $creditAccount;
    }
}
