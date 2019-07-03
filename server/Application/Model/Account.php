<?php

declare(strict_types=1);

namespace Application\Model;

use Application\DBAL\Types\AccountTypeType;
use Application\Traits\HasIban;
use Application\Traits\HasName;
use Application\Traits\HasNumericCode;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;
use Money\Money;

/**
 * Financial account
 *
 * @ORM\Entity(repositoryClass="Application\Repository\AccountRepository")
 * @ORM\AssociationOverrides({
 *     @ORM\AssociationOverride(
 *         name="owner",
 *         inversedBy="accounts",
 *         joinColumns=@ORM\JoinColumn(unique=true, onDelete="SET NULL")
 *     )
 * })
 */
class Account extends AbstractModel
{
    use HasName;
    use HasIban;
    use HasNumericCode;

    /**
     * @var Account
     * @ORM\ManyToOne(targetEntity="Account", inversedBy="children")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="CASCADE")
     * })
     */
    private $parent;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="Account", mappedBy="parent")
     * @ORM\OrderBy({"code" = "ASC"})
     */
    private $children;

    /**
     * @var string
     *
     * @ORM\Column(type="AccountType", length=10)
     */
    private $type;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="TransactionLine", mappedBy="debit")
     */
    private $debitTransactionLines;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="TransactionLine", mappedBy="credit")
     */
    private $creditTransactionLines;

    /**
     * @var Money
     *
     * @ORM\Column(type="Money", options={"default" = 0})
     */
    private $balance;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->balance = Money::CHF(0);
        $this->children = new ArrayCollection();
        $this->debitTransactionLines = new ArrayCollection();
        $this->creditTransactionLines = new ArrayCollection();
    }

    /**
     * Assign the account to an user
     *
     * @param null|User $owner
     */
    public function setOwner(User $owner = null): void
    {
        if ($this->getOwner()) {
            $this->getOwner()->accountRemoved();
        }

        parent::setOwner($owner);

        if ($this->getOwner()) {
            $owner->accountAdded($this);
        }
    }

    /**
     * @return Money
     */
    public function getBalance(): Money
    {
        if ($this->type === AccountTypeType::GROUP) {
            return _em()->getRepository(self::class)->totalBalanceByParent($this);
        }

        return $this->balance;
    }

    /**
     * Set parent
     *
     * @param null|Account $parent
     */
    public function setParent(?self $parent): void
    {
        if ($this->getParent()) {
            $this->getParent()->getChildren()->removeElement($this);
        }

        $this->parent = $parent;

        if ($this->getParent()) {
            $this->getParent()->getChildren()->add($this);
        }
    }

    /**
     * @return null|Account
     */
    public function getParent(): ?self
    {
        return $this->parent;
    }

    /**
     * @return Collection
     */
    public function getChildren(): Collection
    {
        return $this->children;
    }

    /**
     * Set type
     *
     * @API\Input(type="AccountType")
     *
     * @param string $type
     */
    public function setType(string $type): void
    {
        $this->type = $type;
    }

    /**
     * Get type
     *
     * @API\Field(type="AccountType")
     *
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * Notify when a transaction line is added
     * This should only be called by TransactionLine::setDebit()
     *
     * @param TransactionLine $transactionLine
     */
    public function debitTransactionLineAdded(TransactionLine $transactionLine): void
    {
        $this->debitTransactionLines->add($transactionLine);
    }

    /**
     * Notify when a transaction line is removed
     * This should only be called by TransactionLine::setDebit()
     *
     * @param TransactionLine $transactionLine
     */
    public function debitTransactionLineRemoved(TransactionLine $transactionLine): void
    {
        $this->debitTransactionLines->removeElement($transactionLine);
    }

    /**
     * @return Collection
     */
    public function getDebitTransactionLines(): Collection
    {
        return $this->debitTransactionLines;
    }

    /**
     * Notify when a transaction line is added
     * This should only be called by TransactionLine::setCredit()
     *
     * @param TransactionLine $transactionLine
     */
    public function creditTransactionLineAdded(TransactionLine $transactionLine): void
    {
        $this->creditTransactionLines->add($transactionLine);
    }

    /**
     * Notify when a transaction line is removed
     * This should only be called by TransactionLine::setCredit()
     *
     * @param TransactionLine $transactionLine
     */
    public function creditTransactionLineRemoved(TransactionLine $transactionLine): void
    {
        $this->creditTransactionLines->removeElement($transactionLine);
    }

    /**
     * @return Collection
     */
    public function getCreditTransactionLines(): Collection
    {
        return $this->creditTransactionLines;
    }
}
