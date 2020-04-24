#! /usr/bin/env php
<?php

/**
 * A script to update image size data in DB from file on disk
 */
use Application\Model\Image;
use Imagine\Image\ImagineInterface;

require_once __DIR__ . '/../htdocs/index.php';

global $container;

/** @var ImagineInterface $imagine */
$imagine = $container->get(ImagineInterface::class);

$connection = _em()->getConnection();
$filesInDb = _em()->getRepository(Image::class)->getFilenamesForDimensionUpdate();
$count = 0;
$total = count($filesInDb);
foreach ($filesInDb as $i => $row) {
    if ($i === 0 || $i % 200 === 0) {
        echo $i . '/' . $total . PHP_EOL;
    }

    if (!file_exists($row['filename'])) {
        continue;
    }

    $image = $imagine->open($row['filename']);
    $size = $image->getSize();

    // To force clearing the cache of Imagick
    $image->__destruct();

    $width = $size->getWidth();
    $height = $size->getHeight();

    if ($width !== (int) $row['width'] || $height !== (int) $row['height']) {
        $count += $connection->update('image', ['width' => $width, 'height' => $height], ['id' => $row['id']]);
    }
}

echo '
Updated records in DB: ' . $count . '
';
