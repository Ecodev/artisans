<?php

declare(strict_types=1);

namespace Application\Api\Input;

use Application\Model\Product;
use GraphQL\Type\Definition\InputObjectType;

class OrderLineInputType extends InputObjectType
{
    public function __construct()
    {
        $config = [
            'description' => 'A shopping basket item when making an order',
            'fields' => function (): array {
                return [
                    'quantity' => [
                        'type' => self::nonNull(self::string()),
                    ],
                    'type' => [
                        'type' => self::nonNull(_types()->get('ProductType')),
                    ],
                    'isCHF' => [
                        'type' => self::nonNull(self::boolean()),
                    ],
                    'product' => [
                        'type' => self::nonNull(_types()->getId(Product::class)),
                    ],
                ];
            },
        ];

        parent::__construct($config);
    }
}
