<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Account;
use Application\Model\Transaction;
use Application\Model\TransactionLine;
use Application\Model\User;
use Application\Repository\TransactionRepository;
use ApplicationTest\Traits\LimitedAccessSubQuery;
use Cake\Chronos\Chronos;
use Money\Money;

/**
 * @group Repository
 */
class TransactionRepositoryTest extends AbstractRepositoryTest
{
    use LimitedAccessSubQuery;

    /**
     * @var TransactionRepository
     */
    private $repository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Transaction::class);
    }

    public function providerGetAccessibleSubQuery(): array
    {
        $all = [8000, 8001, 8003, 8004, 8005, 8006];
        $family = [8003, 8004, 8005, 8006];

        return [
            ['anonymous', []],
            ['individual', $family],
            ['member', $family],
            ['responsible', $all],
            ['administrator', $all],
        ];
    }

    public function testHydrateLinesAndFlush(): void
    {
        /** @var User $user */
        $user = _em()->getRepository(User::class)->getOneByLogin('administrator');
        User::setCurrent($user);

        $credit = $user->getAccount();
        $debit = _em()->getRepository(Account::class)->findOneBy(['code' => 1000]);

        $transaction = new Transaction();
        $transaction->setName('foo');
        $transaction->setTransactionDate(Chronos::now());
        $line = new TransactionLine();
        $line->setTransaction($transaction);

        self::assertTrue($transaction->getTransactionLines()->contains($line));
        $lines = [
            [
                'balance' => Money::CHF(500),
                'transactionDate' => Chronos::now(),
                'credit' => $credit,
                'debit' => $debit,
            ],
        ];

        $this->repository->hydrateLinesAndFlush($transaction, $lines);

        self::assertTrue(Money::CHF(500)->equals($credit->getBalance()), 'credit account balance must have been refreshed from DB');
        self::assertTrue(Money::CHF(50500)->equals($debit->getBalance()), 'debit account balance must have been refreshed from DB');
        self::assertFalse($transaction->getTransactionLines()->contains($line), 'original line must have been deleted');
        self::assertCount(1, $transaction->getTransactionLines(), 'one line');

        $line = $transaction->getTransactionLines()->first();
        self::assertTrue(Money::CHF(500)->equals($line->getBalance()));
        self::assertSame($credit, $line->getCredit());
        self::assertSame($debit, $line->getDebit());
    }

    public function testHydrateLinesAndFlushMustThrowWithoutAnyLines(): void
    {
        $transaction = new Transaction();

        $this->expectExceptionMessage('A Transaction must have at least one TransactionLine');
        $this->repository->hydrateLinesAndFlush($transaction, []);
    }

    public function testHydrateLinesAndFlushMustThrowWithALineWithoutAnyAccount(): void
    {
        $transaction = new Transaction();
        $this->expectExceptionMessage('Cannot create a TransactionLine without any account');
        $this->repository->hydrateLinesAndFlush($transaction, [[]]);
    }

    public function testHydrateLinesAndFlushMustThrowWithUnbalancedLines(): void
    {
        /** @var User $user */
        $user = _em()->getRepository(User::class)->getOneByLogin('administrator');
        User::setCurrent($user);

        $debit = _em()->getRepository(Account::class)->findOneByCode('20300001');
        $credit = _em()->getRepository(Account::class)->findOneByCode('20300002');

        $transaction = new Transaction();
        $transaction->setName('caisse à poste');
        $transaction->setRemarks('montants erronés');
        $transaction->setTransactionDate(Chronos::now());
        $line = new TransactionLine();
        $line->setTransaction($transaction);

        $lines = [
            [
                'balance' => Money::CHF(100000),
                'transactionDate' => Chronos::now(),
                'debit' => $debit,
            ],
            [
                'balance' => Money::CHF(90000),
                'credit' => $credit,
            ],
        ];

        $this->expectExceptionMessage('Transaction NEW non-équilibrée, débits: 1000.00, crédits: 900.00');
        $this->repository->hydrateLinesAndFlush($transaction, $lines);
    }

    public function testTriggers(): void
    {
        $account1 = 10902;
        $account2 = 10013;

        $this->assertAccountBalance($account1, 21020, 'initial balance');
        $this->assertAccountBalance($account2, 8980, 'initial balance');

        $connection = $this->getEntityManager()->getConnection();
        $count = $connection->delete('transaction', ['id' => 8005]);

        self::assertSame(1, $count);
        $this->assertAccountBalance($account1, 23760, 'balance should be increased after deletion');
        $this->assertAccountBalance($account2, 6240, 'balance should be decreased after deletion');
    }
}
