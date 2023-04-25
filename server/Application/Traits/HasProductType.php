<?php

declare(strict_types=1);

namespace Application\Traits;

use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Attribute as API;

/**
 * Trait for all objects with an type.
 */
trait HasProductType
{
    /**
     * @var string
     */
    #[ORM\Column(type: 'ProductType')]
    private $type;

    /**
     * Set type.
     */
    #[API\Input(type: 'ProductType')]
    public function setType(string $type): void
    {
        $this->type = $type;
    }

    /**
     * Get type.
     */
    #[API\Field(type: 'ProductType')]
    public function getType(): string
    {
        return $this->type;
    }
}
