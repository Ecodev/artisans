<?php

declare(strict_types=1);

use Zend\Diactoros\UploadedFile;

return [
    [
        'query' => 'mutation ($inputImage: ImageInput!) {
            createImage(input: $inputImage) {
                width
                height
            }
        }',
        'variables' => [
            'inputImage' => [
                // Fake a file uploaded with incorrect data, to check if we trust them (we should not)
                'file' => new UploadedFile('data/images/pomme.jpg', 999, UPLOAD_ERR_OK, 'image.jpg', 'text/plain'),
            ],
        ],
    ],
    [
        'data' => [
            'createImage' => [
                'width' => 800,
                'height' => 531,
            ],
        ],
    ],
];
