<?php

declare(strict_types=1);

namespace Application\Traits;

trait HasVatRate
{
    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=10, scale=3, options={"default" = "0.000"})
     */
    private $vatRate = '0';

    /**
     * @return string
     */
    public function getVatRate(): string
    {
        return $this->vatRate;
    }

    /**
     * @param string $vatRate
     */
    public function setVatRate(string $vatRate): void
    {
        $this->vatRate = $vatRate;
    }
}
