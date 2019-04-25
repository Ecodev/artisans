<?php

declare(strict_types=1);

namespace Application\Traits;

trait HasUnit
{
    /**
     * @var string
     *
     * @ORM\Column(type="string", length=10, options={"default" = ""})
     */
    private $unit = '';

    /**
     * Set unit
     *
     * @param string $unit
     */
    public function setUnit(string $unit): void
    {
        $this->unit = $unit;
    }

    /**
     * Get unit
     *
     * @return string
     */
    public function getUnit(): string
    {
        return $this->unit;
    }
}
