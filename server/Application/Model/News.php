<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\NewsRepository;
use Application\Traits\HasDate;
use Application\Traits\HasRichTextDescription;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;

/**
 * A news.
 */
#[ORM\Entity(NewsRepository::class)]
class News extends AbstractModel
{
    use HasDate;
    use HasName;
    use HasRichTextDescription;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    private bool $isActive = false;

    #[ORM\Column(type: 'text', length: 65535, options: ['default' => ''])]
    private string $content = '';

    /**
     * Whether this news is shown.
     */
    public function isActive(): bool
    {
        return $this->isActive;
    }

    /**
     * Whether this news is shown.
     */
    public function setIsActive(bool $isActive): void
    {
        $this->isActive = $isActive;
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
