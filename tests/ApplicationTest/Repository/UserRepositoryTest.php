<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\User;
use Application\Repository\UserRepository;
use ApplicationTest\Traits\LimitedAccessSubQuery;

/**
 * @group Repository
 */
class UserRepositoryTest extends AbstractRepositoryTest
{
    use LimitedAccessSubQuery;

    /**
     * @var UserRepository
     */
    private $repository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(User::class);
    }

    public function providerGetAccessibleSubQuery(): array
    {
        $all = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011];

        return [
            ['anonymous', []],
            ['individual', $all],
            ['member', $all],
            ['responsible', $all],
            ['administrator', $all],
        ];
    }

    public function testGetOneByLoginPassword(): void
    {
        self::assertNull($this->repository->getOneByLoginPassword('foo', 'bar'), 'wrong user');
        self::assertNull($this->repository->getOneByLoginPassword('administrator', 'bar'), 'wrong password');

        $user = $this->repository->getOneByLoginPassword('administrator', 'administrator');
        self::assertNotNull($user);
        self::assertSame(1000, $user->getId());

        $hash = _em()->getConnection()->query('SELECT password FROM `user` WHERE id = 1000')->fetchColumn();
        self::assertStringStartsWith('$', $hash, 'password should have been re-hashed automatically');
        self::assertNotSame(md5('administrator'), $hash, 'password should have been re-hashed automatically');
    }

    public function testGetOneByLogin(): void
    {
        self::assertNull($this->repository->getOneById(1), 'wrong user');

        $user = $this->repository->getOneById(1000);
        self::assertNotNull($user);
        self::assertSame(1000, $user->getId());
    }

    public function testGetAllAdministratorsToNotify(): void
    {
        $actual = $this->repository->getAllAdministratorsToNotify();
        self::assertCount(1, $actual);
    }

    public function testGetAllToQueueBalanceMessage(): void
    {
        $actual = $this->repository->getAllToQueueBalanceMessage();
        self::assertCount(5, $actual);
    }

    public function testGetAllToQueueBalanceMessageNegative(): void
    {
        $actual = $this->repository->getAllToQueueBalanceMessage(true);
        self::assertCount(0, $actual);
    }
}
