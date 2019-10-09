<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Model\File;
use Application\Repository\FileRepository;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response;

class FileAction extends AbstractAction
{
    /**
     * @var FileRepository
     */
    private $fileRepository;

    public function __construct(FileRepository $fileRepository)
    {
        $this->fileRepository = $fileRepository;
    }

    /**
     * Serve a downloaded file from disk
     *
     * @param ServerRequestInterface $request
     * @param RequestHandlerInterface $handler
     *
     * @return ResponseInterface
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $id = $request->getAttribute('id');

        /** @var File $file */
        $file = $this->fileRepository->findOneById($id);
        if (!$file) {
            return $this->createError("File $id not found in database");
        }

        $path = $file->getPath();
        if (!is_readable($path)) {
            return $this->createError("File for $id not found on disk, or not readable");
        }

        $resource = fopen($path, 'r');
        if ($resource === false) {
            return $this->createError("Cannot open file for $id on disk");
        }
        $size = filesize($path);
        $type = mime_content_type($path);
        $response = new Response($resource, 200, ['content-type' => $type, 'content-length' => $size]);

        return $response;
    }
}
