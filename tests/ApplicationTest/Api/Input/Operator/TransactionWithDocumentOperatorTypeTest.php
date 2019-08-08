<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Operator;

use Application\Model\TransactionLine;
use Application\Model\User;

class TransactionWithDocumentOperatorTypeTest extends AbstractOperatorType
{
    public function providerGetDqlCondition(): array
    {
        return [
            [3, [true]],
            [6, [false]],
            [9, [true, false]],
        ];
    }

    /**
     * @dataProvider providerGetDqlCondition
     *
     * @param int $expected
     * @param array $values
     */
    public function testGetDqlCondition(int $expected, array $values): void
    {
        $administrator = new User(User::ROLE_ADMINISTRATOR);
        User::setCurrent($administrator);
        $values = [
            'values' => $values,
        ];
        $actual = $this->getFilteredResult(TransactionLine::class, 'custom', 'transactionWithDocument', $values);
        self::assertCount($expected, $actual);
    }
}
