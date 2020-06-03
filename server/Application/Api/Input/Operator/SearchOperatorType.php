<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Doctrine\ORM\Mapping\ClassMetadata;

class SearchOperatorType extends \Ecodev\Felix\Api\Input\Operator\SearchOperatorType
{
    protected function getSearchableFieldsWhitelist(ClassMetadata $metadata): array
    {
        return [
            'firstName',
            'lastName',
            'code',
            'name',
            'locality',
            'email',
            'description',
            'content',
        ];
    }

    protected function getSearchableJoinedEntities(): array
    {
        return [];
    }
}
