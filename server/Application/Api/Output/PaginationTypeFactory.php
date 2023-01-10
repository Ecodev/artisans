<?php

declare(strict_types=1);

namespace Application\Api\Output;

use Application\Model\Order;
use Application\Model\OrderLine;
use GraphQL\Type\Definition\Type;

/**
 * Create a Pagination type for the entity extracted from name.
 *
 * For example, if given "ActionPagination", it will create a Pagination
 * type for the Action entity.
 */
class PaginationTypeFactory extends \Ecodev\Felix\Api\Output\PaginationTypeFactory
{
    protected function getExtraFields(string $class): array
    {
        $fields = [];
        // Add specific total fields if needed
        if ($class === OrderLine::class) {
            $fields['totalBalanceCHF'] = [
                'type' => _types()->get('CHF'),
                'description' => 'The total balance',
            ];
            $fields['totalBalanceEUR'] = [
                'type' => _types()->get('EUR'),
                'description' => 'The total balance',
            ];
            $fields['totalQuantity'] = [
                'type' => Type::int(),
                'description' => 'The total quantity',
            ];
        } elseif ($class === Order::class) {
            $fields['totalBalanceCHF'] = [
                'type' => _types()->get('CHF'),
                'description' => 'The total balance',
            ];
            $fields['totalBalanceEUR'] = [
                'type' => _types()->get('EUR'),
                'description' => 'The total balance',
            ];
        }

        return $fields;
    }
}
