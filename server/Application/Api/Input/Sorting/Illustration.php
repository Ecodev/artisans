<?php

declare(strict_types=1);

namespace Application\Api\Input\Sorting;

use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Doctrine\Sorting\SortingInterface;

/**
 * Sort product with an illustration first.
 */
class Illustration implements SortingInterface
{
    public function __construct() {}

    public function __invoke(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, string $alias, string $order): void
    {
        $sortingByIllustrationExistence = $uniqueNameFactory->createAliasName('sorting');
        $queryBuilder->addSelect('CASE WHEN ' . $alias . '.illustration IS NOT NULL THEN 1 ELSE 0 END AS HIDDEN ' . $sortingByIllustrationExistence);
        $queryBuilder->addOrderBy($sortingByIllustrationExistence, $order);
    }
}
