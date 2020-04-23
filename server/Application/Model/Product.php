<?php

declare(strict_types=1);

namespace Application\Model;

use Cake\Chronos\Date;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * An item that can be booked by a user
 *
 * @ORM\Entity(repositoryClass="\Application\Repository\ProductRepository")
 */
class Product extends AbstractProduct
{
    /**
     * @var null|int
     *
     * @ORM\Column(type="smallint", nullable=true, options={"unsigned" = true})
     */
    private $readingDuration;

    /**
     * @var Date
     *
     * @ORM\Column(type="date")
     */
    private $releaseDate;

    /**
     * @var null|int
     *
     * @ORM\Column(type="smallint", nullable=true, unique=true, options={"unsigned" = true})
     */
    private $reviewNumber;

    /**
     * @var null|File
     * @ORM\OneToOne(targetEntity="File", orphanRemoval=true)
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $file;

    /**
     * @var null|Product
     *
     * @ORM\ManyToOne(targetEntity="Product")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="CASCADE")
     * })
     */
    private $review;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="ProductTag", mappedBy="products")
     */
    private $productTags;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Product")
     */
    private $relatedProducts;

    /**
     * Constructor
     */
    public function __construct(string $name = '')
    {
        parent::__construct($name);
        $this->productTags = new ArrayCollection();
        $this->relatedProducts = new ArrayCollection();
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
     * Reading duration in minutes
     *
     * @return null|int
     */
    public function getReadingDuration(): ?int
    {
        return $this->readingDuration;
    }

    /**
     * Reading duration in minutes
     *
     * @param null|int $readingDuration
     */
    public function setReadingDuration(?int $readingDuration): void
    {
        $this->readingDuration = $readingDuration;
    }

    /**
     * @return Date
     */
    public function getReleaseDate(): Date
    {
        return $this->releaseDate;
    }

    /**
     * @param Date $releaseDate
     */
    public function setReleaseDate(Date $releaseDate): void
    {
        $this->releaseDate = $releaseDate;
    }

    /**
     * @return null|int
     */
    public function getReviewNumber(): ?int
    {
        return $this->reviewNumber;
    }

    /**
     * @param null|int $reviewNumber
     */
    public function setReviewNumber(?int $reviewNumber): void
    {
        $this->reviewNumber = $reviewNumber;
    }

    /**
     * @return null|File
     */
    public function getFile(): ?File
    {
        return $this->file;
    }

    /**
     * @param null|File $file
     */
    public function setFile(?File $file): void
    {
        // We must trigger lazy loading, otherwise Doctrine will seriously
        // mess up lifecycle callbacks and delete unrelated image on disk
        if ($this->file) {
            $this->file->getFilename();
        }

        $this->file = $file;
    }

    /**
     * Get related products
     *
     * @API\Field(type="Product[]")
     *
     * @return Collection
     */
    public function getRelatedProducts(): Collection
    {
        return $this->relatedProducts;
    }

    /**
     * Add related product
     *
     * @param Product $product
     */
    public function addRelatedProduct(self $product): void
    {
        if ($product === $this) {
            throw new \InvalidArgumentException('A product cannot be related to itself');
        }

        if (!$this->relatedProducts->contains($product)) {
            $this->relatedProducts[] = $product;
        }

        if (!$product->relatedProducts->contains($this)) {
            $product->relatedProducts[] = $this;
        }
    }

    /**
     * Remove related product
     *
     * @param Product $product
     */
    public function removeRelatedProduct(self $product): void
    {
        $this->relatedProducts->removeElement($product);
        $product->relatedProducts->removeElement($this);
    }

    /**
     * @return null|Product
     */
    public function getReview(): ?self
    {
        return $this->review;
    }

    /**
     * @param null|Product $review
     */
    public function setReview(?self $review): void
    {
        $this->review = $review;
    }
}
