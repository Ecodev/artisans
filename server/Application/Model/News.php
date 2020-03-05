<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasDate;
use Application\Traits\HasDescription;
use Application\Traits\HasName;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * A news
 *
 * @ORM\Entity(repositoryClass="Application\Repository\NewsRepository")
 */
class News extends AbstractModel
{
    private const IMAGE_PATH = 'htdocs/news/';

    use HasName;
    use HasDescription;
    use HasDate;

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
     * Get comments sent to the news
     *
     * @return Collection
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    /**
     * Notify the news that it has a new comment
     * This should only be called by Comment::setNews()
     *
     * @param Comment $comment
     */
    public function commentAdded(Comment $comment): void
    {
        $this->comments->add($comment);
    }

    /**
     * Notify the news that a comment was removed
     * This should only be called by Comment::setNews()
     *
     * @param Comment $comment
     */
    public function commentRemoved(Comment $comment): void
    {
        $this->comments->removeElement($comment);
    }
}
