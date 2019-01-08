<?php

declare(strict_types=1);

namespace Application\Model;

use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;
use Imagine\Filter\Basic\Autorotate;
use Imagine\Image\ImagineInterface;
use Psr\Http\Message\UploadedFileInterface;

/**
 * A card containing an image and some information about it
 *
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="Application\Repository\ImageRepository")
 */
class Image extends AbstractFile
{
    /**
     * @const string BASE_PATH where the files are stored in the server
     */
    const BASE_PATH = 'data/images/';

    /**
     * @const array ACCEPTED_MIME_TYPES
     */
    const ACCEPTED_MIME_TYPES = [
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/svg+xml',
    'image/webp',
    ];

    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    private $width = 0;

    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    private $height = 0;

    /**
     * @var Bookable
     * @ORM\ManyToOne(targetEntity="Bookable")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="CASCADE")
     * })
     */
    private $bookable;

    /**
     * Get image width
     *
     * @return int
     */
    public function getWidth(): int
    {
        return $this->width;
    }

    /**
     * Set image width
     *
     * @API\Exclude
     *
     * @param int $width
     */
    public function setWidth(int $width): void
    {
        $this->width = $width;
    }

    /**
     * Get image height
     *
     * @return int
     */
    public function getHeight(): int
    {
        return $this->height;
    }

    /**
     * Set image height
     *
     * @API\Exclude
     *
     * @param int $height
     */
    public function setHeight(int $height): void
    {
        $this->height = $height;
    }

    /**
     * Set the file
     *
     * @param UploadedFileInterface $file
     *
     * @throws \Exception
     */
    public function setFile(UploadedFileInterface $file): void
    {
        parent::setFile($file);
        $this->readFileInfo();
    }

    /**
     * Read dimension and size from file on disk
     */
    private function readFileInfo(): void
    {
        global $container;
        $path = $this->getPath();

        /** @var ImagineInterface $imagine */
        $imagine = $container->get(ImagineInterface::class);
        $image = $imagine->open($path);

        // Auto-rotate image if EXIF says it's rotated
        $autorotate = new Autorotate();
        $autorotate->apply($image);
        $image->save($path);

        $size = $image->getSize();

        $this->setWidth($size->getWidth());
        $this->setHeight($size->getHeight());
    }

    /**
     * @return Bookable
     */
    public function getBookable(): Bookable
    {
        return $this->bookable;
    }

    /**
     * @param Bookable $bookable
     */
    public function setBookable(Bookable $bookable): void
    {
        $this->bookable = $bookable;
    }
}
