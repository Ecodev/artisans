<?php

declare(strict_types=1);

namespace Application\Handler;

use Ecodev\Felix\Handler\AbstractHandler;
use Laminas\Diactoros\Response\TextResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class DownloadCounter extends AbstractHandler
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $path = DownloadFile::COUNTER_PATH;
        if (!is_readable($path)) {
            return $this->createError('File not found on disk, or not readable');
        }

        $response = new TextResponse(file_get_contents($path));

        return $response;
    }
}
