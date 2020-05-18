<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasDate;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;

/**
 * An event
 *
 * @ORM\Entity(repositoryClass="Application\Repository\EventRepository")
 */
class Event extends AbstractModel
{
    use HasName;
    use HasDate;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="Comment", mappedBy="event")
     */
    private $comments;

    public function __construct()
    {
        $this->comments = new ArrayCollection();
    }

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
     */
    public function getType(): string
    {
        return (string) $this->type;
    }

    /**
     * Get comments sent to the event
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    /**
     * Notify the event that it has a new comment
     * This should only be called by Comment::setEvent()
     */
    public function commentAdded(Comment $comment): void
    {
        $this->comments->add($comment);
    }

    /**
     * Notify the event that a comment was removed
     * This should only be called by Comment::setEvent()
     */
    public function commentRemoved(Comment $comment): void
    {
        $this->comments->removeElement($comment);
    }
}
