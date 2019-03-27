<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Transaction;
use Application\Model\TransactionLine;
use Application\Model\User;
use Application\Repository\TransactionRepository;
use ApplicationTest\Traits\LimitedAccessSubQuery;
use Cake\Chronos\Date;

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
        $all = [8000, 8001, 8002, 8003, 8004, 8005];

        return [
            ['anonymous', []],
            ['bookingonly', []],
            ['individual', []],
            ['member', [8000, 8002, 8003, 8004]],
            ['responsible', $all],
            ['administrator', $all],
        ];
    }

    public function testHydrateLinesAndFlush(): void
    {
        /** @var User $user */
        $user = _em()->getRepository(User::class)->getByLogin('administrator');
        User::setCurrent($user);

        $account = $user->getAccount();

        $transaction = new Transaction();
        $transaction->setName('foo');
        $transaction->setTransactionDate(Date::today());
        $line = new TransactionLine();
        $line->setTransaction($transaction);

        self::assertTrue($transaction->getTransactionLines()->contains($line));
        $lines = [
            [
                'balance' => '5',
                'transactionDate' => Date::today(),
                'credit' => $account,
            ],
        ];

        $this->repository->hydrateLinesAndFlush($transaction, $lines);

        self::assertSame('5.00', $account->getBalance(), 'account balance must have been refreshed from DB');
        self::assertFalse($transaction->getTransactionLines()->contains($line), 'original line must have been deleted');
        self::assertCount(1, $transaction->getTransactionLines(), 'one single new line');

        $line = $transaction->getTransactionLines()->first();
        self::assertSame('5', $line->getBalance());
        self::assertSame($account, $line->getCredit());
        self::assertNull($line->getDebit());
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
}
