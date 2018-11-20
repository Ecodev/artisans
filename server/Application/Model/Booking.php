<?php

declare(strict_types=1);

namespace Application\Model;

use Cake\Chronos\Chronos;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * A booking linking a user and several resources
 *
 * @ORM\Entity(repositoryClass="Application\Repository\BookingRepository")
 */
class Booking extends AbstractModel
{
    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="Application\Model\User", inversedBy="bookings")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="SET NULL")
     * })
     */
    private $responsible;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Application\Model\Resource", inversedBy="bookings")
     */
    private $resources;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->resources = new ArrayCollection();
    }

    /**
     * Set responsible
     *
     * @param null|User $responsible
     */
    public function setResponsible(?User $responsible): void
    {
        $this->responsible = $responsible;
        $this->responsible->bookingAdded($this);
    }

    /**
     * Get responsible
     *
     * @return null|User
     */
    public function getResponsible(): ?User
    {
        return $this->responsible;
    }

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
     * @return Chronos
     */
    public function getEndDate(): Chronos
    {
        return $this->endDate;
    }

    /**
     * @param Chronos $endDate
     */
    public function setEndDate(Chronos $endDate): void
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
    public function getResources(): Collection
    {
        return $this->resources;
    }

    /**
     * Add resource
     *
     * @param resource $resource
     */
    public function addResource(Resource $resource): void
    {
        if (!$this->resources->contains($resource)) {
            $this->resources->add($resource);
        }
    }
}
