<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Model\Image;
use Application\Repository\ImageRepository;
use Application\Service\ImageResizer;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response;

class ImageAction extends AbstractAction
{
    /**
     * @var ImageRepository
     */
    private $imageRepository;

    /**
     * @var ImageResizer
     */
    private $imageService;

    public function __construct(ImageRepository $imageRepository, ImageResizer $imageService)
    {
        $this->imageRepository = $imageRepository;
        $this->imageService = $imageService;
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
            $path = $this->imageService->resize($image, $maxHeight);
        }

        $resource = fopen($path, 'r');
        $type = mime_content_type($path);
        $response = new Response($resource, 200, ['content-type' => $type]);

        return $response;
    }
}
