<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasName;
use Application\Traits\HasRemarks;
use Cake\Chronos\Date;
use Doctrine\ORM\Mapping as ORM;

/**
 * A monetary transaction
 *
 * @ORM\Entity(repositoryClass="Application\Repository\TransactionRepository")
 */
class Transaction extends AbstractModel
{
    use hasName;
    use hasRemarks;

    /**
     * @var Account
     *
     * @ORM\ManyToOne(targetEntity="Account", inversedBy="transactions")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
     * })
     */
    private $account;

    /**
     * @var Bookable
     *
     * @ORM\ManyToOne(targetEntity="Bookable", inversedBy="transactions")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=true, onDelete="SET NULL")
     * })
     */
    private $bookable;

    /**
     * @var float
     *
     * @ORM\Column(type="decimal", precision=7, scale=2)
     */
    private $amount;

    /**
     * @var Date
     * @ORM\Column(name="transactionDate", type="date")
     */
    private $transactionDate;

    /**
     * @var string
     *
     * @ORM\Column(type="text", length=65535)
     */
    private $internalRemarks = '';

    /**
     * @var ExpenseClaim
     *
     * @ORM\ManyToOne(targetEntity="ExpenseClaim", inversedBy="transactions")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=true, onDelete="SET NULL")
     * })
     */
    private $expenseClaim;

    /**
     * @var Category
     *
     * @ORM\ManyToOne(targetEntity="Category", inversedBy="transactions")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=true, onDelete="SET NULL")
     * })
     */
    private $category;

    /**
     * Set account
     *
     * @param Account $account
     */
    public function setAccount(Account $account): void
    {
        if ($this->account) {
            $this->account->transactionRemoved($this);
        }
        $this->account = $account;
        $this->account && $this->account->transactionAdded($this);
    }

    /**
     * Get account
     *
     * @return Account
     */
    public function getAccount(): Account
    {
        return $this->account;
    }

    /**
     * Set bookable
     *
     * @param null|Bookable $bookable
     */
    public function setBookable(?Bookable $bookable): void
    {
        if ($this->bookable) {
            $this->bookable->transactionRemoved($this);
        }
        $this->bookable = $bookable;
        $this->bookable && $this->bookable->transactionAdded($this);
    }

    /**
     * Set amount
     *
     * @param float $amount
     */
    public function setAmount(float $amount): void
    {
        $this->amount = $amount;
    }

    /**
     * @return float
     */
    public function getAmount(): float
    {
        return (float) $this->amount;
    }

    /**
     * Set date of transaction
     *
     * @param Date $transactionDate
     */
    public function setTransactionDate(Date $transactionDate): void
    {
        $this->transactionDate = $transactionDate;
    }

    /**
     * Get date of transaction
     *
     * @return Date
     */
    public function getTransactionDate(): Date
    {
        return $this->transactionDate;
    }

    /**
     * Set remarks for internal use
     *
     * @param string $internalRemarks
     */
    public function setInternalRemarks(string $internalRemarks): void
    {
        $this->internalRemarks = $internalRemarks;
    }

    /**
     * Get remarks for internal use
     *
     * @return string
     */
    public function getInternalRemarks(): string
    {
        return $this->internalRemarks;
    }

    /**
     * Set expense claim
     *
     * @param null|ExpenseClaim $expenseClaim
     */
    public function setExpenseClaim(?ExpenseClaim $expenseClaim): void
    {
        if ($this->expenseClaim && $expenseClaim !== $this->expenseClaim) {
            $this->expenseClaim->transactionRemoved($this);
        }

        $this->expenseClaim = $expenseClaim;
        $this->expenseClaim && $this->expenseClaim->transactionAdded($this);
    }

    /**
     * Get expense claim
     *
     * @return null|ExpenseClaim
     */
    public function getExpenseClaim(): ?ExpenseClaim
    {
        return $this->expenseClaim;
    }

    /**
     * Set category
     *
     * @param null|Category $category
     */
    public function setCategory(?Category $category): void
    {
        if ($this->category && $category !== $this->category) {
            $this->category->transactionRemoved($this);
        }

        $this->category = $category;
        $this->category && $this->category->transactionAdded($this);
    }

    /**
     * Get category
     *
     * @return null|Category
     */
    public function getCategory(): ?Category
    {
        return $this->category;
    }
}
