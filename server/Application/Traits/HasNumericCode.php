<?php

declare(strict_types=1);

namespace Application\Traits;

trait HasNumericCode
{
    /**
     * @var null|int
     *
     * @ORM\Column(type="integer", nullable=true, unique=true, options={"unsigned" = true})
     */
    private $code;

    /**
     * Set code
     *
     * @param null|int $code
     */
    public function setCode(?int $code): void
    {
        $this->code = $code;
    }

    /**
     * Get code
     *
     * @return null|int
     */
    public function getCode(): ?int
    {
        return $this->code;
    }
}
