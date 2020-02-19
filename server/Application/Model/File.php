<?php

declare(strict_types=1);

namespace Application\Model;

use Doctrine\ORM\Mapping as ORM;

/**
 * An uploaded file, digital copy of a magazine
 *
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="Application\Repository\FileRepository")
 */
class File extends AbstractFile
{
    protected function getBasePath(): string
    {
        return 'data/file/';
    }

    protected function getAcceptedMimeTypes(): array
    {
        return [
            'image/bmp',
            'image/gif',
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/svg+xml',
            'image/webp',
            'application/pdf',
            'application/x-pdf',
        ];
    }
}
