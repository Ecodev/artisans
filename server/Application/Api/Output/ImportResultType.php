<?php

declare(strict_types=1);

namespace Application\Api\Output;

use GraphQL\Type\Definition\ObjectType;

class ImportResultType extends ObjectType
{
    public function __construct()
    {
        $config = [
            'name' => 'ImportResult',
            'description' => 'Import result',
            'fields' => [
                'updatedUsers' => [
                    'type' => self::nonNull(self::int()),
                ],
                'updatedOrganizations' => [
                    'type' => self::nonNull(self::int()),
                ],
                'deletedOrganizations' => [
                    'type' => self::nonNull(self::int()),
                ],
                'totalUsers' => [
                    'type' => self::nonNull(self::int()),
                ],
                'totalOrganizations' => [
                    'type' => self::nonNull(self::int()),
                ],
                'totalLines' => [
                    'type' => self::nonNull(self::int()),
                ],
                'time' => [
                    'type' => self::nonNull(self::float()),
                ],
            ],
        ];

        parent::__construct($config);
    }
}
