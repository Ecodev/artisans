<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\CommentRepository;
use Application\Traits\HasRichTextDescription;
use Doctrine\ORM\Mapping as ORM;

/**
 * A comment.
 */
#[ORM\Entity(CommentRepository::class)]
class Comment extends AbstractModel
{
    use HasRichTextDescription;

    #[ORM\JoinColumn(nullable: true, onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: Event::class, inversedBy: 'comments')]
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

    #[ORM\JoinColumn(nullable: true, onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: News::class, inversedBy: 'comments')]
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
