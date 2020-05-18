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

    public function getDate(): Chronos
    {
        return $this->date;
    }

    public function setDate(Chronos $date): void
    {
        $this->date = $date;
    }
}
