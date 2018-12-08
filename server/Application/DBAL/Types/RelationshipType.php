<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class RelationshipType extends AbstractEnumType
{
    const HOUSEHOLDER = 'householder';
    const PARTNER = 'partner';
    const EX_PARTNER = 'ex_partner';
    const CHILD = 'child';
    const PARENT = 'parent';
    const SISTER = 'sister';
    const BROTHER = 'brother';

    protected function getPossibleValues(): array
    {
        return [
            self::HOUSEHOLDER,
            self::PARTNER,
            self::EX_PARTNER,
            self::CHILD,
            self::PARENT,
            self::SISTER,
            self::BROTHER,
        ];
    }
}
