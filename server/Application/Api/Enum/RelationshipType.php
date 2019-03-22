<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class RelationshipType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\RelationshipType::HOUSEHOLDER => 'chef(e) de famille',
            \Application\DBAL\Types\RelationshipType::PARTNER => 'conjoint',
            \Application\DBAL\Types\RelationshipType::CHILD => 'enfant',
            \Application\DBAL\Types\RelationshipType::PARENT => 'parent',
            \Application\DBAL\Types\RelationshipType::SISTER => 'soeur',
            \Application\DBAL\Types\RelationshipType::BROTHER => 'frère',
        ];

        parent::__construct($config);
    }
}
