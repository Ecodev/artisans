<?php

declare(strict_types=1);
$pdf_file = '../data/download-file-counter/file.pdf';
$counter_path = '../data/download-file-counter/counter.txt';
$cookie_name = 'artisans_pdf_download_1';

// Increment counter if no cookie = first visit
if (!isset($_COOKIE[$cookie_name])) {
    $download_count = 0;
    if (file_exists($counter_path)) {
        $download_count = (int) (file_get_contents($counter_path));
    }
    ++$download_count;
    file_put_contents($counter_path, $download_count);
}

// Flag cookie
setcookie($cookie_name, 'true', time() + (86400 * 60), '/'); // 60 days

// Do it
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="' . basename($pdf_file) . '"');
readfile($pdf_file);
exit;
