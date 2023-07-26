<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use GraphQL\Doctrine\Definition\Operator\AbstractOperator;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\LeafType;

class RegexpOperatorType extends AbstractOperator
{
    protected function getConfiguration(LeafType $leafType): array
    {
        return [
            'description' => 'Filter users by a regexp pattern on their emails',
            'fields' => [
                [
                    'name' => 'value',
                    'type' => self::string(),
                ],
            ],
        ];
    }

    public function getDqlCondition(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, string $alias, string $field, ?array $args): ?string
    {
        $parameterName = $uniqueNameFactory->createParameterName();
        $queryBuilder->setParameter($parameterName, $args['value']);

        return 'REGEXP(' . $alias . '.email, :' . $parameterName . ') = true';
    }
}
