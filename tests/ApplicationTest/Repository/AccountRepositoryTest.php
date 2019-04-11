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
        $all = range(10000, 10106);

        return [
            ['anonymous', []],
            ['bookingonly', []],
            ['individual', [10097]],
            ['member', [10096]],
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
        self::assertSame('20300009', $account->getCode());
        self::assertSame('Acomptes de clients', $account->getParent()->getName());
        self::assertSame($account, $user->getAccount());
    }

    public function testTotalBalance(): void
    {
        $totalAssets = $this->repository->totalBalanceByType('asset');
        $totalLiabilities = $this->repository->totalBalanceByType('liability');
        $totalRevenue = $this->repository->totalBalanceByType('revenue');
        $totalExpense = $this->repository->totalBalanceByType('expense');
        $totalEquity = $this->repository->totalBalanceByType('equity');

        self::assertEquals(35187.50, $totalAssets);
        self::assertEquals(60, $totalLiabilities);
        self::assertEquals(240, $totalRevenue);
        self::assertEquals(112.50, $totalExpense);
        self::assertEquals(35000, $totalEquity);
    }
}
