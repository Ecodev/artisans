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
     * @ORM\Column(type="date", nullable=true)
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
     * @var bool
     *
     * @ORM\Column(type="boolean", options={"default" = 0})
     */
    private $isHighlighted = false;

    /**
     * @var string
     *
     * @ORM\Column(type="text", length=65535)
     */
    private $content = '';

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
     * @return null|Date
     */
    public function getReleaseDate(): ?Date
    {
        return $this->releaseDate;
    }

    /**
     * @param null|Date $releaseDate
     */
    public function setReleaseDate(?Date $releaseDate): void
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
    }

    /**
     * Remove related product
     *
     * @param Product $product
     */
    public function removeRelatedProduct(self $product): void
    {
        $this->relatedProducts->removeElement($product);
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

    /**
     * Whether this product has more visibility
     *
     * @return bool
     */
    public function isHighlighted(): bool
    {
        return $this->isHighlighted;
    }

    /**
     *Whether this product has more visibility
     *
     * @param bool $isHighlighted
     */
    public function setIsHighlighted(bool $isHighlighted): void
    {
        $this->isHighlighted = $isHighlighted;
    }

    /**
     * Set content
     *
     * @param string $content
     */
    public function setContent(string $content): void
    {
        $content = strip_tags($content);
        $this->content = $content;
    }

    /**
     * Get content
     *
     * @return string
     */
    public function getContent(): string
    {
        // Only administrator is allowed to see a product content
        if (!User::getCurrent() || User::getCurrent()->getRole() !== User::ROLE_ADMINISTRATOR) {
            return '';
        }

        return $this->content;
    }
}
