<?php

declare(strict_types=1);

namespace Application\Traits;

use Doctrine\ORM\Mapping as ORM;

trait IsImportable
{
    /**
     * Whether this should be deleted because it did not exist in last import.
     */
    #[ORM\Column(type: 'boolean', options: ['default' => 0])]
    private bool $shouldDelete = false;

    /**
     * Whether this was found in last import.
     */
    public function getShouldDelete(): bool
    {
        return $this->shouldDelete;
    }
}
