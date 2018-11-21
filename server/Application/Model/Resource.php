<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasDescription;
use Application\Traits\HasName;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * An item that can be booked by a user
 *
 * @ORM\Entity(repositoryClass="Application\Repository\ResourceRepository")
 */
class Resource extends AbstractModel
{
    use HasName;
    use HasDescription;

    /**
     * @var Collection
     * @ORM\ManyToMany(targetEntity="Application\Model\Booking", mappedBy="resources")
     */
    private $bookings;

    /**
     * @var Collection
     * @ORM\ManyToMany(targetEntity="Application\Model\Tag", mappedBy="resources")
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
