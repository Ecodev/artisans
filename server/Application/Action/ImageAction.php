<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Model\Image;
use Application\Repository\ImageRepository;
use Application\Service\ImageResizer;
use Laminas\Diactoros\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class ImageAction extends AbstractAction
{
    /**
     * @var ImageRepository
     */
    private $imageRepository;

    /**
     * @var ImageResizer
     */
    private $imageResizer;

    public function __construct(ImageRepository $imageRepository, ImageResizer $imageService)
    {
        $this->imageRepository = $imageRepository;
        $this->imageResizer = $imageService;
    }

    /**
     * Serve an image from disk, with optional dynamic resizing
     *
     * @param ServerRequestInterface $request
     * @param RequestHandlerInterface $handler
     *
     * @return ResponseInterface
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $id = $request->getAttribute('id');

        /** @var Image $image */
        $image = $this->imageRepository->findOneById($id);
        if (!$image) {
            return $this->createError("Image $id not found in database");
        }

        $path = $image->getPath();
        if (!is_readable($path)) {
            return $this->createError("Image for image $id not found on disk, or not readable");
        }

        $maxHeight = (int) $request->getAttribute('maxHeight');
        if ($maxHeight) {
            $path = $this->imageResizer->resize($image, $maxHeight);
        }

        $resource = fopen($path, 'r');
        if ($resource === false) {
            return $this->createError("Cannot open file for image $id on disk");
        }

        $size = filesize($path);
        $type = mime_content_type($path);

        // Be sure that browser show SVG instead of downloading
        if ($type === 'image/svg') {
            $type = 'image/svg+xml';
        }

        $response = new Response($resource, 200, ['content-type' => $type, 'content-length' => $size]);

        return $response;
    }
}
