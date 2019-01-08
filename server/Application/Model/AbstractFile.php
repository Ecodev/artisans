<?php

declare(strict_types=1);

namespace Application\Model;

use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;
use Psr\Http\Message\UploadedFileInterface;

/**
 * Wrapping class for an uploaded file
 *
 * @ORM\MappedSuperclass
 * @ORM\Table(uniqueConstraints={
 *     @ORM\UniqueConstraint(name="unique_name", columns={"filename"})
 * })
 */
abstract class AbstractFile extends AbstractModel
{
    /**
     * @const string BASE_PATH where the files are stored in the server
     */
    const BASE_PATH = 'data/';

    /**
     * @const array ACCEPTED_MIME_TYPES
     */
    const ACCEPTED_MIME_TYPES = [];

    /**
     * @var string
     * @ORM\Column(type="string", length=255)
     */
    private $filename = '';

    /**
     * Set the file
     *
     * @param UploadedFileInterface $file
     *
     * @throws \Exception
     */
    public function setFile(UploadedFileInterface $file): void
    {
        $this->generateUniqueFilename($file->getClientFilename());

        $path = $this->getPath();
        if (file_exists($path)) {
            throw new \Exception('A file already exist with the same name: ' . $this->getFilename());
        }
        $file->moveTo($path);

        $this->validateMimeType();
    }

    /**
     * Set filename (without path)
     *
     * @API\Exclude
     *
     * @param string $filename
     */
    public function setFilename(string $filename): void
    {
        $this->filename = $filename;
    }

    /**
     * Get filename (without path)
     *
     * @API\Exclude
     *
     * @return string
     */
    public function getFilename(): string
    {
        return $this->filename;
    }

    /**
     * Get absolute path to file on disk
     *
     * @API\Exclude
     *
     * @return string
     */
    public function getPath(): string
    {
        return realpath('.') . '/' . get_called_class()::BASE_PATH . $this->getFilename();
    }

    /**
     * Automatically called by Doctrine when the object is deleted
     * Is called after database update because we can have issues on remove operation (like integrity test)
     * and it's preferable to keep a related file on drive before removing it definitely.
     *
     * @ORM\PostRemove
     */
    public function deleteFile(): void
    {
        $path = $this->getPath();
        if (file_exists($path) && is_file($path) && mb_strpos($this->getFilename(), 'dw4jV3zYSPsqE2CB8BcP8ABD0.') === false) {
            unlink($path);
        }
    }

    /**
     * Generate unique filename while trying to preserve original extension
     *
     * @param string $originalFilename
     */
    private function generateUniqueFilename(string $originalFilename): void
    {
        $extension = pathinfo($originalFilename, PATHINFO_EXTENSION);
        $filename = uniqid() . ($extension ? '.' . $extension : '');
        $this->setFilename($filename);
    }

    /**
     * Delete file and throw exception if MIME type is invalid
     *
     * @throws \Exception
     */
    private function validateMimeType(): void
    {
        $path = $this->getPath();
        $mime = mime_content_type($path);

        // Validate mimetype
        if (!in_array($mime, static::ACCEPTED_MIME_TYPES, true)) {
            unlink($path);

            throw new \Exception('Invalid file type of: ' . $mime);
        }
    }
}
