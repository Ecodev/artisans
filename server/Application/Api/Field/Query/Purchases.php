<?php

declare(strict_types=1);

namespace Application\Api\Field\Query;

use Application\Api\Field\FieldInterface;
use Application\Api\Helper;
use Application\Api\Input\PaginationInputType;
use Application\Model\OrderLine;
use Application\Model\Product;
use GraphQL\Type\Definition\Type;

abstract class Purchases implements FieldInterface
{
    public static function build(): array
    {
        return
            [
                'name' => 'purchases',
                'type' => Type::nonNull(_types()->get('OrderLinePagination')),
                'description' => 'Get purchases of a given user',
                'args' => [
                    [
                        'name' => 'filter',
                        'type' => _types()->getFilter(Product::class),
                    ],
                    [
                        'name' => 'sorting',
                        'type' => _types()->getSorting(Product::class),
                        'defaultValue' => [
                            [
                                'field' => 'releaseDate',
                                'order' => 'ASC',
                            ],
                            [
                                'field' => 'code',
                                'order' => 'DESC',
                            ],
                            [
                                'field' => 'id',
                                'order' => 'ASC',
                            ],
                        ],
                    ],
                    PaginationInputType::build(),
                ],
                'resolve' => function ($root, array $args): array {
                    $orderLineRepository = _em()->getRepository(OrderLine::class);
                    $qb = $orderLineRepository->createPurchaseQueryBuilder($args['filter'] ?? [], $args['sorting'] ?? []);

                    $items = Helper::paginate($args['pagination'], $qb);

                    return $items;
                },
            ];
    }
}
