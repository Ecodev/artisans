<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Product;
use Application\Model\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    protected function tearDown(): void
    {
        User::setCurrent(null);
    }

    /**
     * @dataProvider providerSetRole
     */
    public function testSetRole(string $currentRole, string $oldRole, string $newRole, ?string $exception): void
    {
        User::setCurrent(null);
        if ($currentRole !== User::ROLE_ANONYMOUS) {
            $currentUser = new User($currentRole);
            User::setCurrent($currentUser);
        }

        $user2 = new User($oldRole);

        if ($exception) {
            $this->expectExceptionMessage($exception);
        }

        $user2->setRole($newRole);
        self::assertSame($newRole, $user2->getRole());
    }

    public static function providerSetRole(): iterable
    {
        yield [User::ROLE_ANONYMOUS, User::ROLE_ADMINISTRATOR, User::ROLE_MEMBER, 'anonymous is not allowed to change role from administrator to member'];
        yield [User::ROLE_ANONYMOUS, User::ROLE_MEMBER, User::ROLE_ADMINISTRATOR, 'anonymous is not allowed to change role from member to administrator'];
        yield [User::ROLE_MEMBER, User::ROLE_MEMBER, User::ROLE_MEMBER, null];
        yield [User::ROLE_MEMBER, User::ROLE_MEMBER, User::ROLE_ADMINISTRATOR, 'member is not allowed to change role from member to administrator'];
        yield [User::ROLE_ADMINISTRATOR, User::ROLE_MEMBER, User::ROLE_ADMINISTRATOR, null];
        yield [User::ROLE_ADMINISTRATOR, User::ROLE_ADMINISTRATOR, User::ROLE_MEMBER, null];
    }

    /**
     * @dataProvider providerSetOwner
     */
    public function testSetOwner(?User $currentUser, ?User $originalOwner, ?User $newOwner, ?string $exception = null): void
    {
        User::setCurrent($currentUser);

        $subject = new Product();
        self::assertNull($subject->getOwner());

        $subject->setOwner($originalOwner);
        self::assertSame($originalOwner, $subject->getOwner());

        if ($exception) {
            $this->expectExceptionMessage($exception);
        }

        $subject->setOwner($newOwner);
        self::assertSame($newOwner, $subject->getOwner());
    }

    public static function providerSetOwner(): iterable
    {
        $u1 = new User();
        $u1->setFirstName('u1');
        $u2 = new User();
        $u2->setFirstName('u2');
        $u3 = new User();
        $u3->setFirstName('u3');
        $admin = new User(User::ROLE_ADMINISTRATOR);
        $admin->setFirstName('admin');
        yield 'can change nothing' => [null, null, null];
        yield 'can set owner for first time' => [null, null, $u3];
        yield 'can set owner for first time to myself' => [$u1, null, $u1];
        yield 'can set owner for first time even if it is not myself' => [$u1, null, $u3];
        yield 'can donate my stuff' => [$u1, $u1, $u3];
        yield 'cannot donate stuff that are not mine' => [$u1, $u2, $u3, 'u1 is not allowed to change owner to u3 because it belongs to u2'];
        yield 'admin cannot donate stuff that are not mine' => [$admin, $u2, $u3];
    }
}
