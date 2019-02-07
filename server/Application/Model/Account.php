<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasIban;
use Application\Traits\HasName;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * A transaction account held for a member, or club's bank account
 *
 * @ORM\Entity(repositoryClass="Application\Repository\AccountRepository")
 * @ORM\AssociationOverrides({
 *     @ORM\AssociationOverride(
 *         name="owner",
 *         inversedBy="accounts",
 *         joinColumns=@ORM\JoinColumn(unique=true)
 *     )
 * })
 */
class Account extends AbstractModel
{
    use HasName;
    use HasIban;

    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=7, scale=2, options={"default" = "0.00"})
     */
    private $balance = '0.00';

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="Transaction", mappedBy="account")
     */
    private $transactions;

    public function __construct()
    {
        $this->transactions = new ArrayCollection();
    }

    /**
     * Assign the transaction account to a user
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
     * Set balance
     *
     * @param string $balance
     *
     * @API\Exclude
     */
    public function setBalance(string $balance): void
    {
        $this->balance = $balance;
    }

    /**
     * @return string
     */
    public function getBalance(): string
    {
        return $this->balance;
    }

    /**
     * Get all transactions
     *
     * @return Collection
     */
    public function getTransactions(): Collection
    {
        return $this->transactions;
    }

    /**
     * Notify the account that it has a new transaction
     * This should only be called by Transaction::setAccount()
     *
     * @param Transaction $transaction
     */
    public function transactionAdded(Transaction $transaction): void
    {
        $this->transactions->add($transaction);
    }

    /**
     * Notify the account that a transaction was removed
     * This should only be called by Transaction::setAccount()
     *
     * @param Transaction $transaction
     */
    public function transactionRemoved(Transaction $transaction): void
    {
        $this->transactions->removeElement($transaction);
    }

    /**
     * Notify that an user was added
     *
     * @param null|User $user
     */
    public function userAdded(?User $user): void
    {
        $this->user = $user;
    }
}
