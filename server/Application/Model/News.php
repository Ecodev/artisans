<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasDate;
use Application\Traits\HasRichTextDescription;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;

/**
 * A news
 *
 * @ORM\Entity(repositoryClass="Application\Repository\NewsRepository")
 */
class News extends AbstractModel
{
    use HasName;
    use HasRichTextDescription;
    use HasDate;

    /**
     * @var bool
     *
     * @ORM\Column(type="boolean", options={"default" = 0})
     */
    private $isActive = false;

    /**
     * @var string
     *
     * @ORM\Column(type="text", length=65535, options={"default" = ""})
     */
    private $content = '';

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="Comment", mappedBy="news")
     */
    private $comments;

    public function __construct()
    {
        $this->comments = new ArrayCollection();
    }

    /**
     * Whether this news is shown
     */
    public function isActive(): bool
    {
        return $this->isActive;
    }

    /**
     * Whether this news is shown
     */
    public function setIsActive(bool $isActive): void
    {
        $this->isActive = $isActive;
    }

    /**
     * Get comments sent to the news
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    /**
     * Notify the news that it has a new comment
     * This should only be called by Comment::setNews()
     */
    public function commentAdded(Comment $comment): void
    {
        $this->comments->add($comment);
    }

    /**
     * Notify the news that a comment was removed
     * This should only be called by Comment::setNews()
     */
    public function commentRemoved(Comment $comment): void
    {
        $this->comments->removeElement($comment);
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function setContent(string $content): void
    {
        $this->content = $content;
    }
}
