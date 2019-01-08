<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasColor;
use Application\Traits\HasName;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Hierarchical categories
 *
 * @ORM\Entity(repositoryClass="Application\Repository\CategoryRepository")
 */
class Category extends AbstractModel
{
    use HasName;
    use HasColor;

    /**
     * @var Collection
     * @ORM\ManyToMany(targetEntity="Category", inversedBy="children")
     * @ORM\OrderBy({"name" = "ASC"})
     */
    private $parents;

    /**
     * @var Collection
     * @ORM\ManyToMany(targetEntity="Category", mappedBy="parents")
     * @ORM\OrderBy({"name" = "ASC"})
     */
    private $children;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="Transaction", mappedBy="category")
     */
    private $transactions;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->children = new ArrayCollection();
        $this->parents = new ArrayCollection();
        $this->transactions = new ArrayCollection();
    }

    /**
     * Notify the category that a child category was added
     *
     * @param Category $child
     */
    private function childAdded(self $child): void
    {
        $this->children->add($child);
    }

    /**
     * Notify the category that a child category was removed
     *
     * @param Category $child
     */
    private function childRemoved(self $child): void
    {
        $this->children->removeElement($child);
    }

    /**
     * Add a parent category
     *
     * @param Category $parent
     */
    public function addParent(self $category): void
    {
        $this->parents->add($category);
        $category->childAdded($this);
    }

    public function removeParent(self $category): void
    {
        $this->parents->removeElement($category);
        $category->childRemoved($this);
    }

    /**
     * @return Collection
     */
    public function getParents(): Collection
    {
        return $this->parents;
    }

    /**
     * @return Collection
     */
    public function getChildren(): Collection
    {
        return $this->children;
    }

    /**
     * Notify the category that a transaction was added
     * This should only be called by Transaction::setCategory()
     *
     * @param Transaction $transaction
     */
    public function transactionAdded(Transaction $transaction): void
    {
        $this->transactions->add($transaction);
    }

    /**
     * Notify the category that a transaction was removed
     * This should only be called by Transaction::setCategory()
     *
     * @param Transaction $transaction
     */
    public function transactionRemoved(Transaction $transaction): void
    {
        $this->transactions->removeElement($transaction);
    }

    /**
     * @return Collection
     */
    public function getTransactions(): Collection
    {
        return $this->transactions;
    }
}
