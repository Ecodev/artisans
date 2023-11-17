<?php

declare(strict_types=1);

namespace Application\Traits;

use Cake\Chronos\Chronos;

use Doctrine\ORM\Mapping as ORM;

trait HasDate
{
    #[ORM\Column(type: 'datetime')]
    private Chronos $date;

    public function getDate(): Chronos
    {
        return $this->date;
    }

    public function setDate(Chronos $date): void
    {
        $this->date = $date;
    }
}
