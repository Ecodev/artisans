<?php

declare(strict_types=1);

namespace Application\Traits;

trait HasRemarks
{
    /**
     * @var string
     *
     * @ORM\Column(type="text", length=65535)
     */
    private $remarks = '';

    /**
     * Set remarks
     *
     * @param string $remarks
     */
    public function setRemarks(string $remarks): void
    {
        $this->remarks = $remarks;
    }

    /**
     * Get remarks
     *
     * @return string
     */
    public function getRemarks(): string
    {
        return $this->remarks;
    }
}
