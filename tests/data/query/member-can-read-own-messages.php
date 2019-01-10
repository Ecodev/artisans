<?php

declare(strict_types=1);

return [
    [
        [
            'operationName' => 'Messages',
            'query' => 'query Messages {
                messages {
                    length
                    items {
                        id
                    }
                }
            }',
        ],
        [
            'operationName' => 'Message',
            'query' => 'query Message {
                message(id: 11001) {
                    subject
                }
            }',
        ],
    ],
    [
        [
            'data' => [
                'messages' => [
                    'length' => 1,
                    'items' => [
                        [
                            'id' => 11001,
                        ],
                    ],
                ],
            ],
        ],
        [
            'data' => [
                'message' => [
                    'subject' => 'Avertissement de crédit négatif',
                ],
            ],
        ],
    ],
];
