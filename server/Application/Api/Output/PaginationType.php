<?php

declare(strict_types=1);

namespace Application\Api\Output;

use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\Product;
use Application\Model\StockMovement;
use Application\Model\TransactionLine;
use GraphQL\Type\Definition\ObjectType;

class PaginationType extends ObjectType
{
    public function __construct(string $class, string $name)
    {
        $c = new \ReflectionClass($class);
        $s = $c->getShortName();
        $name = $s . 'Pagination';

        $config = [
            'name' => $name,
            'description' => 'Describe available pages',
            'fields' => function () use ($class): array {
                $fields = [
                    'offset' => [
                        'type' => self::nonNull(self::int()),
                        'description' => 'The zero-based index of the displayed list of items',
                    ],
                    'pageIndex' => [
                        'type' => self::nonNull(self::int()),
                        'description' => 'The zero-based page index of the displayed list of items',
                    ],
                    'pageSize' => [
                        'type' => self::nonNull(self::int()),
                        'description' => 'Number of items to display on a page',
                    ],
                    'length' => [
                        'type' => self::nonNull(self::int()),
                        'description' => 'The length of the total number of items that are being paginated',
                    ],
                    'items' => [
                        'type' => self::nonNull(self::listOf(self::nonNull(_types()->getOutput($class)))),
                        'description' => 'Paginated items',
                    ],
                ];

                // Add specific total fields if needed
                if ($class === Product::class) {
                    $fields['totalSupplierPrice'] = [
                        'type' => _types()->get('Money'),
                        'description' => 'The total supplier price',
                    ];
                    $fields['totalPricePerUnit'] = [
                        'type' => _types()->get('Money'),
                        'description' => 'The total price per unit',
                    ];
                } elseif ($class === TransactionLine::class) {
                    $fields['totalBalance'] = [
                        'type' => _types()->get('Money'),
                        'description' => 'The total balance',
                    ];
                } elseif ($class === OrderLine::class) {
                    $fields['totalBalance'] = [
                        'type' => _types()->get('Money'),
                        'description' => 'The total balance',
                    ];
                } elseif ($class === StockMovement::class) {
                    $fields['totalDelta'] = [
                        'type' => self::string(),
                        'description' => 'The total delta',
                    ];
                } elseif ($class === Order::class) {
                    $fields['totalBalance'] = [
                        'type' => _types()->get('Money'),
                        'description' => 'The total balance',
                    ];
                }

                return $fields;
            },
        ];

        parent::__construct($config);
    }
}
