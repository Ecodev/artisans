<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class BillingTypeType extends AbstractEnumType
{
    const ALL_ELECTRONIC = 'all_electronic';
    const PAPER_BILL_ELECTRONIC_REMINDER = 'paper_bill_electronic_reminder';
    const PAPER_BILL_PAPER_REMINDER = 'paper_bill_paper_reminder';

    protected function getPossibleValues(): array
    {
        return [
            self::ALL_ELECTRONIC,
            self::PAPER_BILL_ELECTRONIC_REMINDER,
            self::PAPER_BILL_PAPER_REMINDER,
        ];
    }
}
