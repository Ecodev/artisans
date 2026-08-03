<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\EventRepository;
use Application\Traits\HasDate;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;

/**
 * An event.
 */
#[ORM\Entity(EventRepository::class)]
class Event extends AbstractModel
{
    use HasDate;
    use HasName;

    #[ORM\Column(type: 'string', length: 191)]
    private string $place;

    /**
     * Set place.
     *
     * @param string $place
     */
    public function setPlace($place): void
    {
        $this->place = $place;
    }

    /**
     * Get place.
     */
    public function getPlace(): string
    {
        return (string) $this->place;
    }

    #[ORM\Column(type: 'string', length: 191)]
    private string $type;

    /**
     * Set type.
     *
     * @param string $type
     */
    public function setType($type): void
    {
        $this->type = $type;
    }

    /**
     * Get type.
     */
    public function getType(): string
    {
        return (string) $this->type;
    }
}
