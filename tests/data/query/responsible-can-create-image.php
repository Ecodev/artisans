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
                'file' => new UploadedFile('data/images/dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 999, UPLOAD_ERR_OK, 'image.jpg', 'text/plain'),
                'bookable' => 3000,
            ],
        ],
    ],
    [
        'data' => [
            'createImage' => [
                'width' => 500,
                'height' => 374,
            ],
        ],
    ],
];
