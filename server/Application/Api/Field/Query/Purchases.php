<?php

declare(strict_types=1);

namespace Application\Api\Field\Query;

use Application\Api\Helper;
use Application\Model\OrderLine;
use Application\Model\Product;
use Application\Repository\OrderLineRepository;
use Ecodev\Felix\Api\Field\FieldInterface;
use Ecodev\Felix\Api\Input\PaginationInputType;
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
                    PaginationInputType::build(_types()),
                ],
                'resolve' => function ($root, array $args): array {
                    /** @var OrderLineRepository $orderLineRepository */
                    $orderLineRepository = _em()->getRepository(OrderLine::class);
                    $qb = $orderLineRepository->createPurchaseQueryBuilder($args['filter'] ?? [], $args['sorting'] ?? []);

                    $items = Helper::paginate($args['pagination'], $qb);

                    return $items;
                },
            ];
    }
}
