<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Api\Enum\ProductTypeType;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Attribute as API;

/**
 * Trait for all objects with an type.
 */
trait HasProductType
{
    #[ORM\Column(type: 'ProductType')]
    private string $type;

    /**
     * Set type.
     */
    #[API\Input(type: ProductTypeType::class)]
    public function setType(string $type): void
    {
        $this->type = $type;
    }

    /**
     * Get type.
     */
    #[API\Field(type: ProductTypeType::class)]
    public function getType(): string
    {
        return $this->type;
    }
}
