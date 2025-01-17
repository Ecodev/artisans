<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Enum\ProductType;
use Doctrine\ORM\Mapping as ORM;

/**
 * Trait for all objects with an type.
 */
trait HasProductType
{
    #[ORM\Column(type: 'ProductType')]
    private ProductType $type;

    /**
     * Set type.
     */
    public function setType(ProductType $type): void
    {
        $this->type = $type;
    }

    /**
     * Get type.
     */
    public function getType(): ProductType
    {
        return $this->type;
    }
}
