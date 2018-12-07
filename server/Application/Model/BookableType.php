<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasName;
use Doctrine\ORM\Mapping as ORM;

/**
 * A type of bookable.
 *
 * Typical values would be: "Voilier", "SUP".
 *
 * @ORM\Entity(repositoryClass="Application\Repository\BookableTypeRepository")
 * @ORM\Table(uniqueConstraints={
 *     @ORM\UniqueConstraint(name="unique_name", columns={"name"})
 * })
 */
class BookableType extends AbstractModel
{
    use HasName;

    /**
     * Constructor
     */
    public function __construct()
    {
    }
}
