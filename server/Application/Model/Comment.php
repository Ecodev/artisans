<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasRichTextDescription;
use Doctrine\ORM\Mapping as ORM;

/**
 * A comment.
 *
 * @ORM\Entity(repositoryClass="Application\Repository\CommentRepository")
 */
class Comment extends AbstractModel
{
    use HasRichTextDescription;

    /**
     * @ORM\ManyToOne(targetEntity="Event", inversedBy="comments")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=true, onDelete="CASCADE")
     * })
     */
    private ?Event $event = null;

    /**
     * Set event.
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
     * Get event.
     */
    public function getEvent(): ?Event
    {
        return $this->event;
    }

    /**
     * @ORM\ManyToOne(targetEntity="News", inversedBy="comments")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=true, onDelete="CASCADE")
     * })
     */
    private ?News $news = null;

    /**
     * Set news.
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
     * Get news.
     */
    public function getNews(): ?News
    {
        return $this->news;
    }

    /**
     * Get owner name.
     */
    public function getAuthorName(): string
    {
        return _em()->getRepository(self::class)->getAclFilter()->runWithoutAcl(function () {
            $user = $this->getOwner();

            return $user ? $user->getName() : 'Anonyme';
        });
    }
}
