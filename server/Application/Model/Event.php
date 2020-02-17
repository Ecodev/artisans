<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasDate;
use Application\Traits\HasName;
use Doctrine\ORM\Mapping as ORM;

/**
 * A news
 *
 * @ORM\Entity(repositoryClass="Application\Repository\EventRepository")
 */
class Event extends AbstractModel
{
    private const IMAGE_PATH = 'htdocs/news/';

    use HasName;
    use HasDate;

    /**
     * @var string
     * @ORM\Column(type="string", length=191)
     */
    private $place;

    /**
     * Set place
     *
     * @param string $place
     */
    public function setPlace($place): void
    {
        $this->place = $place;
    }

    /**
     * Get place
     *
     * @return string
     */
    public function getPlace(): string
    {
        return (string) $this->place;
    }

    /**
     * @var string
     * @ORM\Column(type="string", length=191)
     */
    private $type;

    /**
     * Set type
     *
     * @param string $type
     */
    public function setType($type): void
    {
        $this->type = $type;
    }

    /**
     * Get type
     *
     * @return string
     */
    public function getType(): string
    {
        return (string) $this->type;
    }
}
