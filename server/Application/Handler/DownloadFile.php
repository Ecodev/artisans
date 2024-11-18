<?php

declare(strict_types=1);

namespace Application\Handler;

use Ecodev\Felix\Handler\AbstractHandler;
use Laminas\Diactoros\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class DownloadFile extends AbstractHandler
{
    public const COUNTER_PATH = 'data/download-file-counter/counter.txt';

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $path = 'data/download-file-counter/alternative_groceries_report_nov_2024.pdf';
        $cookie_name = 'artisans_pdf_download_1';

        // Increment counter if no cookie = first visit
        if (!isset($_COOKIE[$cookie_name])) {
            $download_count = 0;
            if (file_exists(self::COUNTER_PATH)) {
                $download_count = (int) (file_get_contents(self::COUNTER_PATH));
            }
            ++$download_count;
            file_put_contents(self::COUNTER_PATH, $download_count);
        }

        // Flag cookie
        setcookie($cookie_name, 'true', time() + (86400 * 60), '/'); // 60 days

        if (!is_readable($path)) {
            return $this->createError('File not found on disk, or not readable');
        }

        $resource = fopen($path, 'rb');
        if ($resource === false) {
            return $this->createError('Cannot open file on disk');
        }

        $size = filesize($path);
        $response = new Response($resource, 200, [
            'content-type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . basename($path) . '"',
            'content-length' => $size,
        ]);

        return $response;
    }
}
