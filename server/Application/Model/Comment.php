<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasDescription;
use Doctrine\ORM\Mapping as ORM;

/**
 * A news
 *
 * @ORM\Entity(repositoryClass="Application\Repository\CommentRepository")
 */
class Comment extends AbstractModel
{
    use HasDescription;

    /**
     * @var null|Event
     *
     * @ORM\ManyToOne(targetEntity="Event", inversedBy="comments")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=true, onDelete="CASCADE")
     * })
     */
    private $event;

    /**
     * Set event
     *
     * @param null|Event $event
     */
    public function setEvent(?Event $event): void
    {
        if ($this->event) {
            $this->event->commentRemoved($this);
        }

        $this->event = $event;

        if ($this->event) {
            $this->event->commentAdded($this);
        }
    }

    /**
     * Get event
     *
     * @return null|Event
     */
    public function getEvent(): ?Event
    {
        return $this->event;
    }

    /**
     * @var null|News
     *
     * @ORM\ManyToOne(targetEntity="News", inversedBy="comments")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=true, onDelete="CASCADE")
     * })
     */
    private $news;

    /**
     * Set news
     *
     * @param null|News $news
     */
    public function setNews(?News $news): void
    {
        if ($this->news) {
            $this->news->commentRemoved($this);
        }

        $this->news = $news;

        if ($this->news) {
            $this->news->commentAdded($this);
        }
    }

    /**
     * Get news
     *
     * @return null|News
     */
    public function getNews(): ?News
    {
        return $this->news;
    }

    /**
     * Get owner name
     *
     * @return string
     */
    public function getAuthorName(): string
    {
        return _em()->getRepository(self::class)->getAclFilter()->runWithoutAcl(function () {
            return $this->getOwner()->getName();
        });
    }
}
