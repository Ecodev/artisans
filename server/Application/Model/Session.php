<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasDescription;
use Application\Traits\HasName;
use Cake\Chronos\Date;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * A session that a human can physically go to
 *
 * @ORM\Entity(repositoryClass="Application\Repository\SessionRepository")
 */
class Session extends AbstractModel
{
    use HasName;
    use HasDescription;

    /**
     * @var string
     *
     * @ORM\Column(type="string", options={"default" = ""})
     */
    private $region = '';

    /**
     * @var string
     *
     * @ORM\Column(type="string", options={"default" = ""})
     */
    private $locality = '';

    /**
     * @var string
     *
     * @ORM\Column(type="string", options={"default" = ""})
     */
    private $street = '';

    /**
     * @var string
     *
     * @ORM\Column(type="string", options={"default" = ""})
     */
    private $price = '';

    /**
     * @var string
     *
     * @ORM\Column(type="string", options={"default" = ""})
     */
    private $availability = '';

    /**
     * Used for display
     *
     * @var string[]
     *
     * @ORM\Column(type="json")
     */
    private $dates = [];

    /**
     * Used for filter + sorting. Represents the first date
     *
     * @var Date
     *
     * @ORM\Column(type="date")
     */
    private $startDate;

    /**
     * @var Collection
     * @ORM\ManyToMany(targetEntity="User", inversedBy="sessions")
     */
    private $facilitators;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->facilitators = new ArrayCollection();
    }

    /**
     * @return string
     */
    public function getLocality(): string
    {
        return $this->locality;
    }

    /**
     * @param string $locality
     */
    public function setLocality(string $locality): void
    {
        $this->locality = $locality;
    }

    /**
     * @return string
     */
    public function getRegion(): string
    {
        return $this->region;
    }

    /**
     * @param string $region
     */
    public function setRegion(string $region): void
    {
        $this->region = $region;
    }

    /**
     * @return string
     */
    public function getStreet(): string
    {
        return $this->street;
    }

    /**
     * @param string $street
     */
    public function setStreet(string $street): void
    {
        $this->street = $street;
    }

    /**
     * @return string
     */
    public function getPrice(): string
    {
        return $this->price;
    }

    /**
     * @param string $price
     */
    public function setPrice(string $price): void
    {
        $this->price = $price;
    }

    /**
     * @return string
     */
    public function getAvailability(): string
    {
        return $this->availability;
    }

    /**
     * @param string $availability
     */
    public function setAvailability(string $availability): void
    {
        $this->availability = $availability;
    }

    /**
     * List of dates
     *
     *
     * @return string[]
     */
    public function getDates(): array
    {
        return $this->dates;
    }

    /**
     * List of dates
     *
     * @param string[] $dates
     */
    public function setDates(array $dates): void
    {
        $this->dates = $dates;
    }

    /**
     * @return Date
     */
    public function getStartDate(): Date
    {
        return $this->startDate;
    }

    /**
     * @param Date $startDate
     */
    public function setStartDate(Date $startDate): void
    {
        $this->startDate = $startDate;
    }

    /**
     * @return Collection
     */
    public function getFacilitators(): Collection
    {
        return $this->facilitators;
    }

    /**
     * Add facilitator
     *
     * @param User $facilitator
     */
    public function addFacilitator(User $facilitator): void
    {
        if (!$this->facilitators->contains($facilitator)) {
            $this->facilitators->add($facilitator);
            $facilitator->sessionAdded($this);
        }
    }

    /**
     * Remove facilitator
     *
     * @param User $facilitator
     */
    public function removeFacilitator(User $facilitator): void
    {
        $this->facilitators->removeElement($facilitator);
        $facilitator->sessionRemoved($this);
    }
}
