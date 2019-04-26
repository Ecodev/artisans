<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\DBAL\Types\AccountTypeType;
use Application\Model\Account;
use Application\Model\User;
use Application\Repository\AccountRepository;
use ApplicationTest\Traits\LimitedAccessSubQuery;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;

/**
 * @group Repository
 */
class AccountRepositoryTest extends AbstractRepositoryTest
{
    use LimitedAccessSubQuery;

    /**
     * @var AccountRepository
     */
    private $repository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Account::class);
    }

    public function providerGetAccessibleSubQuery(): array
    {
        $range = range(10000, 10045);
        $all = array_merge([
            -10011,
            -10010,
            -10007,
            -10002,
            -10001,
            -10000,
        ], array_diff($range, [10015, 10016, 10017]));

        return [
            ['anonymous', []],
            ['individual', [-10007]],
            ['member', [-10002]],
            ['responsible', $all],
            ['administrator', $all],
        ];
    }

    public function testOneUserCanHaveOnlyOneAccount(): void
    {
        $this->expectException(UniqueConstraintViolationException::class);
        $this->getEntityManager()->getConnection()->insert('account', ['owner_id' => -1000, 'iban' => uniqid()]);
    }

    public function testGetOrCreate(): void
    {
        $user = new User();
        $user->setFirstName('Foo');
        $user->setLastName('Bar');

        $account = $this->repository->getOrCreate($user);

        self::assertSame($user, $account->getOwner());
        self::assertSame('Foo Bar', $account->getName());
        self::assertSame(AccountTypeType::LIABILITY, $account->getType());
        self::assertSame('20300007', $account->getCode());
        self::assertSame('Acomptes de clients', $account->getParent()->getName());
        self::assertSame($account, $user->getAccount());

        $account2 = $this->repository->getOrCreate($user);
        self::assertSame($account, $account2, 'should return the same one if called more than once');
    }

    public function testGetOrCreateInMemory(): void
    {
        $user = new User();
        $account = new Account();
        $account->setOwner($user);

        $actualAccount = $this->repository->getOrCreate($user);

        self::assertSame($account, $actualAccount, 'should return the in-memory account if existing');
    }

    public function testTotalBalance(): void
    {
        $totalAssets = $this->repository->totalBalanceByType(AccountTypeType::ASSET);
        $totalLiabilities = $this->repository->totalBalanceByType(AccountTypeType::LIABILITY);
        $totalRevenue = $this->repository->totalBalanceByType(AccountTypeType::REVENUE);
        $totalExpense = $this->repository->totalBalanceByType(AccountTypeType::EXPENSE);
        $totalEquity = $this->repository->totalBalanceByType(AccountTypeType::EQUITY);

        self::assertEquals(24700, $totalAssets);
        self::assertEquals(210.20, $totalLiabilities);
        self::assertEquals(89.80, $totalRevenue);
        self::assertEquals(100.00, $totalExpense);
        self::assertEquals(24500.00, $totalEquity);
    }
}
