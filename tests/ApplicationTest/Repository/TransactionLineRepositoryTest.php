<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\TransactionLine;
use Application\Repository\TransactionLineRepository;
use ApplicationTest\Traits\LimitedAccessSubQuery;

/**
 * @group Repository
 */
class TransactionLineRepositoryTest extends AbstractRepositoryTest
{
    use LimitedAccessSubQuery;

    /**
     * @var TransactionLineRepository
     */
    private $repository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(TransactionLine::class);
    }

    public function providerGetAccessibleSubQuery(): array
    {
        $all = range(14000, 14008);
        $family = [14005, 14006, 14007, 14008];

        return [
            ['anonymous', []],
            ['individual', $family],
            ['member', $family],
            ['responsible', $all],
            ['administrator', $all],
        ];
    }

    public function testTriggers(): void
    {
        $account1 = 10902;
        $account2 = 10013;
        $account3 = 10029;
        $account4 = 10030;

        $this->assertAccountBalance($account1, '210.20', 'initial balance');
        $this->assertAccountBalance($account2, '89.80', 'initial balance');
        $this->assertAccountBalance($account3, '500.00', 'initial balance');
        $this->assertAccountBalance($account4, '22700.00', 'initial balance');

        $connection = $this->getEntityManager()->getConnection();
        $connection->insert('transaction_line', [
            'transaction_id' => 8000,
            'debit_id' => $account1,
            'credit_id' => $account2,
            'balance' => '5.00',
        ]);

        $id = $connection->lastInsertId();

        $this->assertAccountBalance($account1, '205.20', 'balance should be reduced when line is inserted');
        $this->assertAccountBalance($account2, '94.80', 'balance should be increased when line is inserted');

        $count = $connection->update('transaction_line',
            [
                'balance' => '40.00',
            ],
            [
                'id' => $id,
            ]
        );
        self::assertSame(1, $count);
        $this->assertAccountBalance($account1, '170.20', 'balance should be reduced even more after update');
        $this->assertAccountBalance($account2, '129.80', 'balance should be increased even more after update');

        $count = $connection->update('transaction_line',
            [
                'debit_id' => $account3,
                'credit_id' => $account4,
            ],
            [
                'id' => $id,
            ]
        );
        self::assertSame(1, $count);
        $this->assertAccountBalance($account1, '210.20', 'balance should be restored to its original value after deletion');
        $this->assertAccountBalance($account2, '89.80', 'balance should be restored to its original value after deletion');
        $this->assertAccountBalance($account3, '540.00', 'balance should be increased after swapped account');
        $this->assertAccountBalance($account4, '22660.00', 'balance should be reduced after swapped account');

        $count = $connection->delete('transaction_line', ['id' => $id]);
        self::assertSame(1, $count);
        $this->assertAccountBalance($account1, '210.20', 'balance should be restored to its original value after deletion');
        $this->assertAccountBalance($account2, '89.80', 'balance should be restored to its original value after deletion');
        $this->assertAccountBalance($account3, '500.00', 'balance should be restored to its original value after deletion');
        $this->assertAccountBalance($account4, '22700.00', 'balance should be restored to its original value after deletion');
    }
}
