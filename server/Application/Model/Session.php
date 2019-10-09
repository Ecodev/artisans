<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasDescription;
use Application\Traits\HasName;
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
    private $place = '';

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
     * @var array
     *
     * @ORM\Column(type="json")
     */
    private $dates = [];

    /**
     * @return string
     */
    public function getPlace(): string
    {
        return $this->place;
    }

    /**
     * @param string $place
     */
    public function setPlace(string $place): void
    {
        $this->place = $place;
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
     * @return array
     */
    public function getDates(): array
    {
        return $this->dates;
    }

    /**
     * List of dates
     *
     * @param array $dates
     */
    public function setDates(array $dates): void
    {
        $this->dates = $dates;
    }
}
