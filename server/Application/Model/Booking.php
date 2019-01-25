<?php

declare(strict_types=1);

namespace Application\Model;

use Application\DBAL\Types\BookingStatusType;
use Cake\Chronos\Chronos;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * A booking linking a user and several bookables
 *
 * @ORM\Entity(repositoryClass="Application\Repository\BookingRepository")
 * @ORM\AssociationOverrides({
 *     @ORM\AssociationOverride(name="owner", inversedBy="bookings")
 * })
 */
class Booking extends AbstractModel
{
    /**
     * @var string
     *
     * @ORM\Column(type="BookingStatus", length=10, options={"default" = BookingStatusType::APPLICATION})
     */
    private $status = BookingStatusType::APPLICATION;

    /**
     * @var int
     * @ORM\Column(type="integer", options={"unsigned" = true, "default" = 1})
     */
    private $participantCount = 1;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=50, options={"default" = ""})
     */
    private $destination = '';

    /**
     * @var string
     *
     * @ORM\Column(type="text", length=65535, options={"default" = ""})
     */
    private $startComment = '';

    /**
     * @var string
     *
     * @ORM\Column(type="text", length=65535, options={"default" = ""})
     */
    private $endComment = '';

    /**
     * @var Chronos
     *
     * @ORM\Column(type="datetime")
     */
    private $startDate;

    /**
     * @var Chronos
     *
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $endDate;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=50, options={"default" = ""})
     */
    private $estimatedEndDate = '';

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Bookable", inversedBy="bookings")
     */
    private $bookables;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->bookables = new ArrayCollection();
    }

    public function setOwner(User $owner = null): void
    {
        if ($this->getOwner()) {
            $this->getOwner()->bookingRemoved($this);
        }

        parent::setOwner($owner);

        if ($this->getOwner()) {
            $this->getOwner()->bookingAdded($this);
        }
    }

    /**
     * Total count of participant, at least 1.
     *
     * @return int
     */
    public function getParticipantCount(): int
    {
        return $this->participantCount;
    }

    /**
     * @param int $participantCount
     */
    public function setParticipantCount(int $participantCount): void
    {
        $this->participantCount = $participantCount;
    }

    /**
     * @return string
     */
    public function getDestination(): string
    {
        return $this->destination;
    }

    /**
     * @param string $destination
     */
    public function setDestination(string $destination): void
    {
        $this->destination = $destination;
    }

    /**
     * @return string
     */
    public function getStartComment(): string
    {
        return $this->startComment;
    }

    /**
     * @param string $startComment
     */
    public function setStartComment(string $startComment): void
    {
        $this->startComment = $startComment;
    }

    /**
     * @return string
     */
    public function getEndComment(): string
    {
        return $this->endComment;
    }

    /**
     * @param string $endComment
     */
    public function setEndComment(string $endComment): void
    {
        $this->endComment = $endComment;
    }

    /**
     * @return Chronos
     */
    public function getStartDate(): Chronos
    {
        return $this->startDate;
    }

    /**
     * @param Chronos $startDate
     */
    public function setStartDate(Chronos $startDate): void
    {
        $this->startDate = $startDate;
    }

    /**
     * @return null|Chronos
     */
    public function getEndDate(): ?Chronos
    {
        return $this->endDate;
    }

    /**
     * @param null|Chronos $endDate
     */
    public function setEndDate(?Chronos $endDate): void
    {
        $this->endDate = $endDate;
    }

    /**
     * @return string
     */
    public function getEstimatedEndDate(): string
    {
        return $this->estimatedEndDate;
    }

    /**
     * @param string $estimatedEndDate
     */
    public function setEstimatedEndDate(string $estimatedEndDate): void
    {
        $this->estimatedEndDate = $estimatedEndDate;
    }

    /**
     * @return Collection
     */
    public function getBookables(): Collection
    {
        return $this->bookables;
    }

    /**
     * Add bookable
     *
     * @param Bookable $bookable
     */
    public function addBookable(Bookable $bookable): void
    {
        if (!$this->bookables->contains($bookable)) {
            $this->bookables->add($bookable);
            $bookable->bookingAdded($this);
        }
    }

    /**
     * Remove bookable
     *
     * @param Bookable $bookable
     */
    public function removeBookable(Bookable $bookable): void
    {
        $this->bookables->removeElement($bookable);
        $bookable->bookingRemoved($this);
    }

    /**
     * @API\Field(type="BookingStatus")
     *
     * @return string
     */
    public function getStatus(): string
    {
        return $this->status;
    }

    /**
     * @API\Input(type="BookingStatus")
     *
     * @param string $status
     */
    public function setStatus(string $status): void
    {
        $this->status = $status;
    }
}
