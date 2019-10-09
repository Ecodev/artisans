<?php

declare(strict_types=1);

namespace Application\Traits;

use Cake\Chronos\Chronos;

trait HasDate
{
    /**
     * @var Chronos
     *
     * @ORM\Column(type="datetime")
     */
    private $date;

    /**
     * @return Chronos
     */
    public function getDate(): Chronos
    {
        return $this->date;
    }

    /**
     * @param Chronos $date
     */
    public function setDate(Chronos $date): void
    {
        $this->date = $date;
    }
}
