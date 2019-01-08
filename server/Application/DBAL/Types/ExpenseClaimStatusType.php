<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class ExpenseClaimStatusType extends AbstractEnumType
{
    const NEW = 'new';
    const PROCESSED = 'processed';
    const REJECTED = 'rejected';

    protected function getPossibleValues(): array
    {
        return [
            self::NEW,
            self::PROCESSED,
            self::REJECTED,
        ];
    }
}
