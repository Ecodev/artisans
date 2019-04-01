<?php

declare(strict_types=1);

namespace Application\Traits;

use Doctrine\ORM\Mapping as ORM;

/**
 * Trait for all objects with an URL
 */
trait HasUrl
{
    /**
     * @var string
     * @ORM\Column(type="string", length=2000)
     */
    private $url = '';

    /**
     * Set url
     *
     * @param string $url
     */
    public function setUrl(string $url): void
    {
        $this->url = $url;
    }

    /**
     * Get url
     *
     * @return string
     */
    public function getUrl(): string
    {
        return $this->url;
    }
}
