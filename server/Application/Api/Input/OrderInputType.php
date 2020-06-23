<?php

declare(strict_types=1);

namespace Application\Api\Input;

use Application\Model\Country;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;

class OrderInputType extends InputObjectType
{
    public function __construct()
    {
        $config = [
            'description' => 'A shopping cart order.',
            'fields' => function (): array {
                return [
                    'paymentMethod' => [
                        'type' => self::nonNull(_types()->get('PaymentMethod')),
                    ],
                    'orderLines' => [
                        'type' => Type::nonNull(Type::listOf(Type::nonNull(_types()->get('OrderLineInput')))),
                    ],

                    // Billing address
                    'firstName' => [
                        'type' => self::string(),
                    ],
                    'lastName' => [
                        'type' => self::string(),
                    ],
                    'street' => [
                        'type' => self::string(),
                    ],
                    'postcode' => [
                        'type' => self::string(),
                    ],
                    'locality' => [
                        'type' => self::string(),
                    ],
                    'country' => [
                        'type' => _types()->getId(Country::class),
                    ],
                ];
            },
        ];

        parent::__construct($config);
    }
}
