<?php

declare(strict_types=1);

namespace Application\Model;

use Application\DBAL\Types\BookableStateType;
use Application\DBAL\Types\BookingTypeType;
use Application\Traits\HasCode;
use Application\Traits\HasDescription;
use Application\Traits\HasName;
use Application\Traits\HasRemarks;
use Cake\Chronos\Date;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * An item that can be booked by a user
 *
 * @ORM\Entity(repositoryClass="Application\Repository\BookableRepository")
 */
class Bookable extends AbstractModel
{
    use HasName;
    use HasDescription;
    use HasCode;
    use HasRemarks;

    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=7, scale=2, options={"default" = "0.00"})
     */
    private $initialPrice = '0';

    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=7, scale=2, options={"default" = "0.00"})
     */
    private $periodicPrice = '0';

    /**
     * @var int
     *
     * @ORM\Column(type="smallint", options={"unsigned" = true, "default" = "1"})
     */
    private $simultaneousBookingMaximum = 1;

    /**
     * @var string
     *
     * @ORM\Column(type="BookingType", length=10, options={"default" = BookingTypeType::SELF_APPROVED})
     */
    private $bookingType = BookingTypeType::SELF_APPROVED;

    /**
     * @var bool
     *
     * @ORM\Column(type="boolean", options={"default" = 1})
     */
    private $isActive = true;

    /**
     * @var string
     *
     * @ORM\Column(type="BookableState", length=10, options={"default" = BookableStateType::GOOD})
     */
    private $state = BookableStateType::GOOD;

    /**
     * @var null|Date
     * @ORM\Column(type="date", nullable=true)
     */
    private $verificationDate;

    /**
     * @var BookableTag
     *
     * @ORM\ManyToMany(targetEntity="BookableTag", mappedBy="bookables")
     */
    private $bookableTags;

    /**
     * @var Collection
     * @ORM\ManyToMany(targetEntity="Booking", mappedBy="bookables")
     */
    private $bookings;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="Transaction", mappedBy="bookable")
     */
    private $transactions;

    /**
     * @var Collection
     * @ORM\ManyToMany(targetEntity="License", mappedBy="bookables")
     */
    private $licenses;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->bookings = new ArrayCollection();
        $this->licenses = new ArrayCollection();
        $this->bookableTags = new ArrayCollection();
        $this->transactions = new ArrayCollection();
    }

    /**
     * @return Collection
     */
    public function getBookings(): Collection
    {
        return $this->bookings;
    }

    /**
     * Notify the bookable that it has a new booking.
     * This should only be called by Booking::addBookable()
     *
     * @param Booking $booking
     */
    public function bookingAdded(Booking $booking): void
    {
        $this->bookings->add($booking);
    }

    /**
     * Notify the bookable that it a booking was removed.
     * This should only be called by Booking::removeBookable()
     *
     * @param Booking $booking
     */
    public function bookingRemoved(Booking $booking): void
    {
        $this->bookings->removeElement($booking);
    }

    /**
     * @return Collection
     */
    public function getLicenses(): Collection
    {
        return $this->licenses;
    }

    /**
     * Notify the bookable that it has a new license.
     * This should only be called by License::addBookable()
     *
     * @param License $license
     */
    public function licenseAdded(License $license): void
    {
        $this->licenses->add($license);
    }

    /**
     * Notify the bookable that it a license was removed.
     * This should only be called by License::removeBookable()
     *
     * @param License $license
     */
    public function licenseRemoved(License $license): void
    {
        $this->licenses->removeElement($license);
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
     * @return int
     */
    public function getSimultaneousBookingMaximum(): int
    {
        return $this->simultaneousBookingMaximum;
    }

    /**
     * @param int $simultaneousBookingMaximum
     */
    public function setSimultaneousBookingMaximum(int $simultaneousBookingMaximum): void
    {
        $this->simultaneousBookingMaximum = $simultaneousBookingMaximum;
    }

    /**
     * @API\Field(type="BookingType")
     *
     * @return string
     */
    public function getBookingType(): string
    {
        return $this->bookingType;
    }

    /**
     * Whether this bookable can be booked
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->isActive;
    }

    /**
     * Whether this bookable can be booked
     *
     * @param bool $isActive
     */
    public function setIsActive(bool $isActive): void
    {
        $this->isActive = $isActive;
    }

    /**
     * @API\Input(type="BookingType")
     *
     * @param string $state
     */
    public function setBookingType(string $state): void
    {
        $this->bookingType = $state;
    }

    /**
     * State of the bookable
     *
     * @API\Field(type="BookableState")
     *
     * @return string
     */
    public function getState(): string
    {
        return $this->state;
    }

    /**
     * State of the bookable
     *
     * @API\Input(type="BookableState")
     *
     * @param string $state
     */
    public function setState(string $state): void
    {
        $this->state = $state;
    }

    /**
     * The date then the bookable was last checked
     *
     * @return null|Date
     */
    public function getVerificationDate(): ?Date
    {
        return $this->verificationDate;
    }

    /**
     * The date then the bookable was last checked
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
    public function getBookableTags(): Collection
    {
        return $this->bookableTags;
    }

    /**
     * Notify the user that it has a new bookableTag.
     * This should only be called by BookableTag::addUser()
     *
     * @param BookableTag $bookableTag
     */
    public function bookableTagAdded(BookableTag $bookableTag): void
    {
        $this->bookableTags->add($bookableTag);
    }

    /**
     * Notify the user that it a bookableTag was removed.
     * This should only be called by BookableTag::removeUser()
     *
     * @param BookableTag $bookableTag
     */
    public function bookableTagRemoved(BookableTag $bookableTag): void
    {
        $this->bookableTags->removeElement($bookableTag);
    }

    /**
     * @return Collection
     */
    public function getTransactions(): Collection
    {
        return $this->transactions;
    }

    /**
     * Notify the bookable that it has a new transaction.
     * This should only be called by Transaction::setBookable()
     *
     * @param Transaction $transaction
     */
    public function transactionAdded(Transaction $transaction): void
    {
        $this->transactions->add($transaction);
    }

    /**
     * Notify the bookable that one of its transactions was removed
     * This should only be called by Transaction::setBookable()
     *
     * @param Transaction $transaction
     */
    public function transactionRemoved(Transaction $transaction): void
    {
        $this->transactions->removeElement($transaction);
    }
}
