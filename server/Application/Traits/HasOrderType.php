<?php

declare(strict_types=1);

namespace Application\Traits;

use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * Trait for all objects with an type
 */
trait HasOrderType
{
    /**
     * @var string
     * @ORM\Column(type="OrderType")
     */
    private $type;

    /**
     * Set type
     *
     * @API\Input(type="OrderType")
     *
     * @param string $type
     */
    public function setType(string $type): void
    {
        $this->type = $type;
    }

    /**
     * Get type
     *
     * @API\Field(type="OrderType")
     *
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }
}
