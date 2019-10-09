<?php

declare(strict_types=1);

namespace Application\Model;

use Cake\Chronos\Date;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

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
     * @var int
     *
     * @ORM\Column(type="smallint", options={"unsigned" = true})
     */
    private $reviewNumber;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="ProductTag", mappedBy="products")
     */
    private $productTags;

    /**
     * Constructor
     */
    public function __construct(string $name = '')
    {
        parent::__construct($name);
        $this->productTags = new ArrayCollection();
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
     * @return int
     */
    public function getReviewNumber(): int
    {
        return $this->reviewNumber;
    }

    /**
     * @param int $reviewNumber
     */
    public function setReviewNumber(int $reviewNumber): void
    {
        $this->reviewNumber = $reviewNumber;
    }
}
