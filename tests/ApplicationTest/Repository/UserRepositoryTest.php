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
        $all = [-1011, -1010, -1009, -1008, -1007, -1006, -1005, -1004, -1003, -1002, -1001, -1000];

        return [
            ['anonymous', []],
            ['bookingonly', $all],
            ['individual', $all],
            ['member', $all],
            ['responsible', $all],
            ['administrator', $all],
        ];
    }

    public function testGetByLoginPassword(): void
    {
        self::assertNull($this->repository->getByLoginPassword('foo', 'bar'), 'wrong user');
        self::assertNull($this->repository->getByLoginPassword('administrator', 'bar'), 'wrong password');

        $user = $this->repository->getByLoginPassword('administrator', 'administrator');
        self::assertNotNull($user);
        self::assertSame(-1000, $user->getId());

        $hash = _em()->getConnection()->query('SELECT password FROM `user` WHERE id = -1000')->fetchColumn();
        self::assertStringStartsWith('$', $hash, 'password should have been re-hashed automatically');
        self::assertNotSame(md5('administrator'), $hash, 'password should have been re-hashed automatically');
    }

    public function testGetByLogin(): void
    {
        self::assertNull($this->repository->getOneById(1), 'wrong user');

        $user = $this->repository->getOneById(-1000);
        self::assertNotNull($user);
        self::assertSame(-1000, $user->getId());
    }

    public function testGetAllAdministratorsToNotify(): void
    {
        $actual = $this->repository->getAllAdministratorsToNotify();
        self::assertCount(1, $actual);
    }
}
