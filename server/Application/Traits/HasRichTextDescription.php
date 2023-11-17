<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Utility;

use Doctrine\ORM\Mapping as ORM;

trait HasRichTextDescription
{
    #[ORM\Column(type: 'text', length: 65535)]
    private string $description = '';

    /**
     * Set description.
     */
    public function setDescription(string $description): void
    {
        $this->description = Utility::sanitizeRichText($description);
    }

    /**
     * Get description.
     */
    public function getDescription(): string
    {
        return $this->description;
    }
}
