<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasName;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * A transaction account held for a member, or club's bank account
 *
 * @ORM\Entity(repositoryClass="Application\Repository\AccountRepository")
 */
class Account extends AbstractModel
{
    use hasName;

    /**
     * @var User
     *
     * @ORM\OneToOne(targetEntity="User", mappedBy="account")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="SET NULL")
     * })
     */
    private $user;

    /**
     * @var float
     *
     * @ORM\Column(type="decimal", precision=7, scale=2, options={"default" = "0.00"})
     */
    private $balance = 0;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=32, unique=true)
     */
    private $iban;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="Transaction", mappedBy="account")
     */
    private $transactions;

    public function __construct(string $name = '')
    {
        $this->transactions = new ArrayCollection();
    }

    /**
     * Assign the transaction account to an user
     *
     * @param null|User $user
     */
    public function setUser(?User $user): void
    {
        $previousUser = $this->user;

        $this->user = $user;
        if ($user) {
            $user->setAccount($this);
        }

        if ($previousUser && $previousUser !== $user) {
            $previousUser->setAccount(null);
        }
    }

    /**
     * Get the user holding the account, or null we are a bank account
     *
     * @return null|User
     */
    public function getUser(): ?User
    {
        return $this->user;
    }

    /**
     * Set balance
     *
     * @param float $balance
     */
    public function setBalance(float $balance): void
    {
        $this->balance = $balance;
    }

    /**
     * @return float
     */
    public function getBalance(): float
    {
        return $this->balance;
    }

    /**
     * Set the IBAN (international bank account number)
     *
     * @param string $iban
     */
    public function setIban(string $iban): void
    {
        $this->iban = $iban;
    }

    /**
     * Get the IBAN (international bank account number)
     *
     * @return string
     */
    public function getIban(): string
    {
        return $this->iban;
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
