<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\FacilitatorDocumentRepository;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;

/**
 * An item that can be booked by a user.
 */
#[ORM\Entity(FacilitatorDocumentRepository::class)]
class FacilitatorDocument extends AbstractModel
{
    use HasName;

    #[ORM\OneToOne(targetEntity: File::class, orphanRemoval: true)]
    #[ORM\JoinColumn(onDelete: 'SET NULL')]
    private ?File $file = null;

    #[ORM\Column(type: 'string', length: 191)]
    private string $category = '';

    public function getFile(): ?File
    {
        return $this->file;
    }

    public function setFile(?File $file): void
    {
        // We must trigger lazy loading, otherwise Doctrine will seriously
        // mess up lifecycle callbacks and delete unrelated image on disk
        if ($this->file) {
            $this->file->getFilename();
        }

        $this->file = $file;
    }

    /**
     * Set category.
     */
    public function setCategory(string $category): void
    {
        $this->category = $category;
    }

    /**
     * Get category.
     */
    public function getCategory(): string
    {
        return $this->category;
    }
}
