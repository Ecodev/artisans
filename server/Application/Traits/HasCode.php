<?php

declare(strict_types=1);

namespace Application\Traits;

trait HasCode
{
    /**
     * @var string
     *
     * @ORM\Column(type="string", length=20, options={"default" = ""})
     */
    private $code = '';

    /**
     * Set code
     *
     * @param string $code
     */
    public function setCode(string $code): void
    {
        $this->code = $code;
    }

    /**
     * Get code
     *
     * @return string
     */
    public function getCode(): string
    {
        return $this->code;
    }
}
