<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Api\Input\Sorting\Illustration;
use Application\Repository\ProductRepository;
use Cake\Chronos\ChronosDate;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Attribute as API;
use InvalidArgumentException;

/**
 * An item that can be booked by a user.
 */
#[API\Sorting(Illustration::class)]
#[ORM\Entity(ProductRepository::class)]
class Product extends AbstractProduct
{
    #[ORM\Column(type: 'smallint', nullable: true, options: ['unsigned' => true])]
    private ?int $readingDuration = null;

    #[ORM\Column(type: 'date', nullable: true)]
    private ?ChronosDate $releaseDate = null;

    #[ORM\Column(type: 'smallint', nullable: true, unique: true, options: ['unsigned' => true])]
    private ?int $reviewNumber = null;

    #[ORM\OneToOne(targetEntity: File::class, orphanRemoval: true)]
    #[ORM\JoinColumn(onDelete: 'SET NULL')]
    private ?File $file = null;

    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: self::class)]
    private ?Product $review = null;

    /**
     * @var Collection<int, ProductTag>
     */
    #[ORM\ManyToMany(targetEntity: ProductTag::class, mappedBy: 'products')]
    private Collection $productTags;

    /**
     * @var Collection<int, Product>
     */
    #[ORM\ManyToMany(targetEntity: self::class, inversedBy: 'inversedRelatedProducts')]
    private Collection $relatedProducts;

    /**
     * @var Collection<int, Product>
     */
    #[ORM\ManyToMany(targetEntity: self::class, mappedBy: 'relatedProducts')]
    private Collection $inversedRelatedProducts;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    private bool $isHighlighted = false;

    #[ORM\Column(type: 'text', length: 65535, options: ['default' => ''])]
    private string $content = '';

    #[ORM\Column(type: 'smallint', options: ['default' => 0])]
    private int $sorting = 0;

    public function __construct(string $name = '')
    {
        parent::__construct($name);
        $this->productTags = new ArrayCollection();
        $this->relatedProducts = new ArrayCollection();
        $this->inversedRelatedProducts = new ArrayCollection();
    }

    public function getProductTags(): Collection
    {
        return $this->productTags;
    }

    /**
     * Notify the user that it has a new productTag.
     * This should only be called by ProductTag::addUser().
     */
    public function productTagAdded(ProductTag $productTag): void
    {
        $this->productTags->add($productTag);
    }

    /**
     * Notify the user that it a productTag was removed.
     * This should only be called by ProductTag::removeUser().
     */
    public function productTagRemoved(ProductTag $productTag): void
    {
        $this->productTags->removeElement($productTag);
    }

    /**
     * Reading duration in minutes.
     */
    public function getReadingDuration(): ?int
    {
        return $this->readingDuration;
    }

    /**
     * Reading duration in minutes.
     */
    public function setReadingDuration(?int $readingDuration): void
    {
        $this->readingDuration = $readingDuration;
    }

    public function getReleaseDate(): ?ChronosDate
    {
        return $this->releaseDate;
    }

    public function setReleaseDate(?ChronosDate $releaseDate): void
    {
        $this->releaseDate = $releaseDate;
    }

    public function getReviewNumber(): ?int
    {
        return $this->reviewNumber;
    }

    public function setReviewNumber(?int $reviewNumber): void
    {
        $this->reviewNumber = $reviewNumber;
    }

    public function getFile(): ?File
    {
        return $this->file;
    }

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
     * Get related products.
     */
    public function getRelatedProducts(): Collection
    {
        return $this->relatedProducts;
    }

    /**
     * Add related product.
     */
    public function addRelatedProduct(self $product): void
    {
        if ($product === $this) {
            throw new InvalidArgumentException('A product cannot be related to itself');
        }

        if (!$this->relatedProducts->contains($product)) {
            $this->relatedProducts[] = $product;
        }
    }

    /**
     * Remove related product.
     */
    public function removeRelatedProduct(self $product): void
    {
        $this->relatedProducts->removeElement($product);
    }

    public function getReview(): ?self
    {
        return $this->review;
    }

    public function setReview(?self $review): void
    {
        $this->review = $review;
    }

    /**
     * Whether this product has more visibility.
     */
    public function isHighlighted(): bool
    {
        return $this->isHighlighted;
    }

    /**
     *Whether this product has more visibility.
     */
    public function setIsHighlighted(bool $isHighlighted): void
    {
        $this->isHighlighted = $isHighlighted;
    }

    /**
     * Set content.
     */
    public function setContent(string $content): void
    {
        $content = strip_tags($content);
        $this->content = $content;
    }

    /**
     * Get content.
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
