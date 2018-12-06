<?php

declare(strict_types=1);

namespace Application\Model;

use Application\DBAL\Types\BookingTypeType;
use Application\Traits\HasCode;
use Application\Traits\HasDescription;
use Application\Traits\HasName;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

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

    /**
     * @var string
     *
     * @ORM\Column(type="decimal", length=10, options={"default" = "0"})
     */
    private $initialPrice = '0.00';

    /**
     * @var string
     *
     * @ORM\Column(type="decimal", length=10, options={"default" = "0"})
     */
    private $periodicPrice = '0.00';

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
     * @var Collection
     * @ORM\ManyToMany(targetEntity="Application\Model\Booking", mappedBy="bookables")
     */
    private $bookings;

    /**
     * @var Collection
     * @ORM\ManyToMany(targetEntity="License", mappedBy="bookables")
     */
    private $tags;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->bookings = new ArrayCollection();
        $this->tags = new ArrayCollection();
    }

    /**
     * @return Collection
     */
    public function getBookings(): Collection
    {
        return $this->bookings;
    }

    /**
     * @return Collection
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }
}
