<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Model\Country;
use Doctrine\ORM\Mapping as ORM;

/**
 * Common fields to represent an address.
 */
trait HasAddress
{
    /**
     * @var string
     * @ORM\Column(type="string", options={"default" = ""})
     */
    private $street = '';

    /**
     * @var string
     * @ORM\Column(type="string", length=20, options={"default" = ""})
     */
    private $postcode = '';

    /**
     * @var string
     * @ORM\Column(type="string", length=255, options={"default" = ""})
     */
    private $locality = '';

    /**
     * @var Country
     * @ORM\ManyToOne(targetEntity="Country")
     * @ORM\JoinColumn(nullable=true, onDelete="SET NULL")
     */
    private $country;

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
    public function getPostcode(): string
    {
        return $this->postcode;
    }

    /**
     * @param string $postcode
     */
    public function setPostcode(string $postcode): void
    {
        $this->postcode = $postcode;
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
     * @return null|Country
     */
    public function getCountry(): ?Country
    {
        return $this->country;
    }

    /**
     * @param null|Country $country
     */
    public function setCountry(?Country $country = null): void
    {
        $this->country = $country;
    }
}
