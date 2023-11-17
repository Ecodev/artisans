<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\User;
use Application\Repository\UserRepository;
use ApplicationTest\Traits\LimitedAccessSubQuery;

class UserRepositoryTest extends AbstractRepositoryTest
{
    use LimitedAccessSubQuery;

    private UserRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(User::class);
    }

    public function providerGetAccessibleSubQuery(): iterable
    {
        $all = [1000, 1001, 1002, 1003];
        yield ['anonymous', [1001]];
        yield ['member', $all];
        yield ['facilitator', $all];
        yield ['administrator', $all];
    }

    public function testGetOneByEmailPassword(): void
    {
        self::assertNull($this->repository->getOneByEmailPassword('foo@example.com', 'bar'), 'wrong user');
        self::assertNull($this->repository->getOneByEmailPassword('administrator@example.com', 'bar'), 'wrong password');

        $user = $this->repository->getOneByEmailPassword('administrator@example.com', 'administrator');
        self::assertNotNull($user);
        self::assertSame(1000, $user->getId());

        $hash = _em()->getConnection()->executeQuery('SELECT password FROM `user` WHERE id = 1000')->fetchOne();
        self::assertStringStartsWith('$', $hash, 'password should have been re-hashed automatically');
        self::assertNotSame(md5('administrator'), $hash, 'password should have been re-hashed automatically');
    }

    public function testGetOneById(): void
    {
        self::assertNull($this->repository->getOneById(1), 'wrong user');

        $user = $this->repository->getOneById(1000);
        self::assertNotNull($user);
        self::assertSame(1000, $user->getId());
    }

    public function testRecordLogin(): void
    {
        User::setCurrent($this->repository->getOneById(1000));

        /** @var User $user */
        $user = $this->getEntityManager()->getReference(User::class, 1002);

        self::assertNull($user->getFirstLogin());
        self::assertNull($user->getLastLogin());
        $this->assertNoStamp($user);

        $user->recordLogin();
        $this->getEntityManager()->flush();

        $firstLogin = $user->getFirstLogin();
        $lastLogin = $user->getLastLogin();
        self::assertNotNull($firstLogin);
        self::assertNotNull($lastLogin);
        $this->assertNoStamp($user);

        $user->recordLogin();
        $this->getEntityManager()->flush();

        $firstLogin2 = $user->getFirstLogin();
        $lastLogin2 = $user->getLastLogin();
        self::assertSame($firstLogin, $firstLogin2);
        self::assertNotSame($lastLogin, $lastLogin2);
        self::assertNotNull($firstLogin2);
        self::assertNotNull($lastLogin2);
        $this->assertNoStamp($user);
    }

    private function assertNoStamp(User $user): void
    {
        $count = $this->getEntityManager()->getConnection()->fetchOne('SELECT COUNT(*) FROM user WHERE id = ' . $user->getId() . ' AND creation_date IS NULL AND creator_id IS NULL AND update_date IS NULL AND updater_id IS NULL');
        self::assertSame(1, $count);
    }
}
