<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\SessionRepository;
use Application\Traits\HasRichTextDescription;
use Cake\Chronos\ChronosDate;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasInternalRemarks;
use Ecodev\Felix\Model\Traits\HasName;

/**
 * A session that a human can physically go to.
 */
#[ORM\Entity(SessionRepository::class)]
class Session extends AbstractModel
{
    use HasInternalRemarks;
    use HasName;
    use HasRichTextDescription;

    #[ORM\Column(type: 'string', options: ['default' => ''])]
    private string $region = '';

    #[ORM\Column(type: 'string', options: ['default' => ''])]
    private string $locality = '';

    #[ORM\Column(type: 'string', options: ['default' => ''])]
    private string $street = '';

    #[ORM\Column(type: 'string', options: ['default' => ''])]
    private string $mailingList = '';

    #[ORM\Column(type: 'string', options: ['default' => ''])]
    private string $price = '';

    #[ORM\Column(type: 'string', options: ['default' => ''])]
    private string $availability = '';

    /**
     * Used for display.
     *
     * @var string[]
     */
    #[ORM\Column(type: 'json')]
    private array $dates = [];

    /**
     * Used for filter + sorting. Represents the first date.
     */
    #[ORM\Column(type: 'date')]
    private ChronosDate $startDate;

    /**
     * Used for filter + sorting. Represents the first date.
     */
    #[ORM\Column(type: 'date')]
    private ChronosDate $endDate;

    /**
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'sessions')]
    private Collection $facilitators;

    public function __construct()
    {
        $this->facilitators = new ArrayCollection();
    }

    public function getLocality(): string
    {
        return $this->locality;
    }

    public function setLocality(string $locality): void
    {
        $this->locality = $locality;
    }

    public function getRegion(): string
    {
        return $this->region;
    }

    public function setRegion(string $region): void
    {
        $this->region = $region;
    }

    public function getStreet(): string
    {
        return $this->street;
    }

    public function setStreet(string $street): void
    {
        $this->street = $street;
    }

    public function getMailingList(): string
    {
        return $this->mailingList;
    }

    public function setMailingList(string $mailingList): void
    {
        $this->mailingList = $mailingList;
    }

    public function getPrice(): string
    {
        return $this->price;
    }

    public function setPrice(string $price): void
    {
        $this->price = $price;
    }

    public function getAvailability(): string
    {
        return $this->availability;
    }

    public function setAvailability(string $availability): void
    {
        $this->availability = $availability;
    }

    /**
     * List of dates.
     *
     * @return string[]
     */
    public function getDates(): array
    {
        return $this->dates;
    }

    /**
     * List of dates.
     *
     * @param string[] $dates
     */
    public function setDates(array $dates): void
    {
        $this->dates = $dates;
    }

    public function getStartDate(): ChronosDate
    {
        return $this->startDate;
    }

    public function setStartDate(ChronosDate $startDate): void
    {
        $this->startDate = $startDate;
    }

    public function getEndDate(): ChronosDate
    {
        return $this->endDate;
    }

    public function setEndDate(ChronosDate $endDate): void
    {
        $this->endDate = $endDate;
    }

    public function getFacilitators(): Collection
    {
        return $this->facilitators;
    }

    /**
     * Add facilitator.
     */
    public function addFacilitator(User $facilitator): void
    {
        if (!$this->facilitators->contains($facilitator)) {
            $this->facilitators->add($facilitator);
            $facilitator->sessionAdded($this);
        }
    }

    /**
     * Remove facilitator.
     */
    public function removeFacilitator(User $facilitator): void
    {
        $this->facilitators->removeElement($facilitator);
        $facilitator->sessionRemoved($this);
    }
}
