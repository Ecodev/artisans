<?php

declare(strict_types=1);

use Application\DBAL\Types\PaymentMethodType;
use Application\DBAL\Types\ProductTypeType;

return [
    [
        'query' => 'mutation ($input: OrderInput!) {
            createOrder(input: $input) {
                paymentMethod
                balanceCHF
                balanceEUR
                orderLines {
                    quantity
                    type
                    balanceCHF
                    balanceEUR
                    additionalEmails
                }
            }
        }',
        'variables' => [
            'input' => [
                'paymentMethod' => PaymentMethodType::BVR,
                'orderLines' => [
                    [
                        'subscription' => 19005,
                        'quantity' => 1,
                        'isCHF' => true,
                        'type' => ProductTypeType::DIGITAL,
                        'additionalEmails' => [
                            'foo@example.com',
                            'bar@example.com',
                        ],
                    ],
                ],
            ],
        ],
    ],
    [
        'data' => [
            'createOrder' => [
                'paymentMethod' => PaymentMethodType::BVR,
                'balanceCHF' => '185.00',
                'balanceEUR' => '0.00',
                'orderLines' => [
                    [
                        'quantity' => 1,
                        'type' => ProductTypeType::BOTH,
                        'balanceCHF' => '185.00',
                        'balanceEUR' => '0.00',
                        'additionalEmails' => [
                            'foo@example.com',
                            'bar@example.com',
                        ],
                    ],
                ],
            ],
        ],

    ],
];
