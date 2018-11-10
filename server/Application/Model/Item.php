<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasDescription;
use Application\Traits\HasName;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * User
 *
 * @ORM\Entity(repositoryClass="Application\Repository\ItemRepository")
 */
class Item extends AbstractModel
{
    use HasName;
    use HasDescription;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Application\Model\Booking", mappedBy="items")
     */
    private $bookings;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->bookings = new ArrayCollection();
    }

    /**
     * @return Collection
     */
    public function getBookings(): Collection
    {
        return $this->bookings;
    }
}
