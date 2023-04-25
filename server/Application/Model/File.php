<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\FileRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * An uploaded file, digital copy of a magazine.
 */
#[ORM\UniqueConstraint(name: 'unique_name', columns: ['filename'])]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(FileRepository::class)]
class File extends AbstractModel implements \Ecodev\Felix\Model\File
{
    use \Ecodev\Felix\Model\Traits\File;

    protected function getAcceptedMimeTypes(): array
    {
        return [
            'image/bmp',
            'image/x-ms-bmp',
            'image/gif',
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/svg+xml',
            'image/webp',
            'application/pdf',
            'application/x-pdf',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
    }
}
