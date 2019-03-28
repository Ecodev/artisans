<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Sorting;

use PHPUnit\Framework\TestCase;

class AbstractSorting extends TestCase
{
    protected function getSortedQueryResult(string $class, string $field): array
    {
        $sorting = $this->getSorting($field);
        $qb = _types()->createFilteredQueryBuilder($class, [], $sorting);

        $result = [];
        foreach ($qb->getQuery()->getResult() as $item) {
            $result[] = $item->getId();
        }

        return $result;
    }

    private function getSorting(string $field): array
    {
        return [
            [
                'field' => $field,
                'order' => 'DESC',
            ],
            [
                'field' => 'id',
                'order' => 'ASC',
            ],
        ];
    }
}
