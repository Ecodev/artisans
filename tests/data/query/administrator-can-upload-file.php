<?php

declare(strict_types=1);

use Zend\Diactoros\UploadedFile;

return [
    [
        'query' => 'mutation ($inputDocument: FileInput!) {
            createFile(input: $inputDocument) {
                product {
                    id
                }
            }
        }',
        'variables' => [
            'inputDocument' => [
                // Fake a file uploaded with incorrect data, to check if we trust them (we should not)
                'file' => new UploadedFile('data/file/dw4jV3zYSPsqE2CB8BcP8ABD0.pdf', 999, UPLOAD_ERR_OK, 'invoice.pdf', 'text/plain'),
                'product' => 3000,
            ],
        ],
    ],
    [
        'data' => [
            'createFile' => [
                'product' => [
                    'id' => 3000,
                ],
            ],
        ],
    ],
];