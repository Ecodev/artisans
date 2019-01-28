<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Booking;
use Application\Model\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    public function tearDown(): void
    {
        User::setCurrent(null);
    }

    public function testGetGlobalPermissions(): void
    {
        $user = new User();
        $actual = $user->getGlobalPermissions();
        $expected = [
            'account' => [
                'create' => true,
            ],
            'accountingDocument' => [
                'create' => true,
            ],
            'bookable' => [
                'create' => false,
            ],
            'bookableMetadata' => [
                'create' => false,
            ],
            'bookableTag' => [
                'create' => false,
            ],
            'booking' => [
                'create' => true,
            ],
            'category' => [
                'create' => false,
            ],
            'country' => [
                'create' => false,
            ],
            'expenseClaim' => [
                'create' => true,
            ],
            'image' => [
                'create' => false,
            ],
            'license' => [
                'create' => false,
            ],
            'message' => [
                'create' => false,
            ],
            'user' => [
                'create' => true,
            ],
            'userTag' => [
                'create' => false,
            ],

        ];
        self::assertEquals($expected, $actual);

        $expectedForAdmin = [
            'account' => [
                'create' => true,
            ],
            'accountingDocument' => [
                'create' => true,
            ],
            'bookable' => [
                'create' => true,
            ],
            'bookableMetadata' => [
                'create' => true,
            ],
            'bookableTag' => [
                'create' => true,
            ],
            'booking' => [
                'create' => true,
            ],
            'category' => [
                'create' => true,
            ],
            'country' => [
                'create' => false,
            ],
            'expenseClaim' => [
                'create' => true,
            ],
            'image' => [
                'create' => true,
            ],
            'license' => [
                'create' => true,
            ],
            'message' => [
                'create' => false,
            ],
            'user' => [
                'create' => true,
            ],
            'userTag' => [
                'create' => true,
            ],

        ];

        User::setCurrent($user);
        self::assertSame($user, User::getCurrent());

        $admin = new User(User::ROLE_ADMINISTRATOR);
        $actualForAdmin = $admin->getGlobalPermissions();

        self::assertEquals($expectedForAdmin, $actualForAdmin);
        self::assertSame($user, User::getCurrent());
        self::assertNotEquals($expectedForAdmin, $expected);
    }

    /**
     * @dataProvider providerSetRole
     *
     * @param string $currentRole
     * @param string $oldRole
     * @param string $newRole
     * @param null|string $exception
     */
    public function testSetRole(string $currentRole, string $oldRole, string $newRole, ?string $exception): void
    {
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

    public function providerSetRole(): array
    {
        return [
            [User::ROLE_ANONYMOUS, User::ROLE_ADMINISTRATOR, User::ROLE_MEMBER, 'anonymous is not allowed to change role to member'],
            [User::ROLE_ANONYMOUS, User::ROLE_MEMBER, User::ROLE_ADMINISTRATOR, 'anonymous is not allowed to change role to administrator'],

            [User::ROLE_MEMBER, User::ROLE_MEMBER, User::ROLE_MEMBER, null],
            [User::ROLE_MEMBER, User::ROLE_MEMBER, User::ROLE_ADMINISTRATOR, 'member is not allowed to change role to administrator'],

            [User::ROLE_ADMINISTRATOR, User::ROLE_MEMBER, User::ROLE_ADMINISTRATOR, null],
            [User::ROLE_ADMINISTRATOR, User::ROLE_ADMINISTRATOR, User::ROLE_MEMBER, null],
        ];
    }

    public function testSetPassword(): void
    {
        $user = new User();
        self::assertNull($user->getPassword(), 'should have no password at first');

        $user->setPassword('12345');
        $actual1 = $user->getPassword();
        self::assertNotSame('', $actual1, 'should be able to change password ');
        self::assertTrue(password_verify('12345', $actual1), 'password must have been hashed');

        $user->setPassword('');
        $actual2 = $user->getPassword();
        self::assertSame($actual1, $actual2, 'should ignore empty password');

        $user->setPassword('money');
        $actual3 = $user->getPassword();
        self::assertNotSame($actual1, $actual3, 'should be able to change to something else');
        self::assertTrue(password_verify('money', $actual3), 'password must have been hashed again');
    }

    /**
     * @dataProvider providerSetOwner
     */
    public function testSetOwner(?User $currentUser, ?User $originalOwner, ?User $newOwner, ?string $exception = null): void
    {
        User::setCurrent($currentUser);

        $subject = new Booking();
        self::assertNull($subject->getOwner());

        $subject->setOwner($originalOwner);
        self::assertSame($originalOwner, $subject->getOwner());

        if ($exception) {
            $this->expectExceptionMessage($exception);
        }

        $subject->setOwner($newOwner);
        self::assertSame($newOwner, $subject->getOwner());
    }

    public function providerSetOwner(): array
    {
        $u1 = new User();
        $u1->setLogin('u1');
        $u2 = new User();
        $u2->setLogin('u2');
        $u3 = new User();
        $u3->setLogin('u3');
        $admin = new User(User::ROLE_ADMINISTRATOR);
        $admin->setLogin('admin');

        return [
            'can change nothing' => [null, null, null],
            'can set owner for first time' => [null, null, $u3],
            'can set owner for first time to myself' => [$u1, null, $u1],
            'can set owner for first time even if it is not myself' => [$u1, null, $u3],
            'can donate my stuff' => [$u1, $u1, $u3],
            'cannot donate stuff that are not mine' => [$u1, $u2, $u3, 'u1 is not allowed to change owner to u3 because it belongs to u2'],
            'admin cannot donate stuff that are not mine' => [$admin, $u2, $u3],
        ];
    }

    public function testIndividualCannotOwnUsers(): void
    {
        $u1 = new User();
        $u2 = new User();
        $u3 = new User();

        $u1->setOwner($u1);
        $u2->setOwner($u1);

        $this->expectExceptionMessage('This user cannot be owned by a user who is himself owned by somebody else');
        $u3->setOwner($u2);
    }

    public function testIndividualCannotOwnUsers2(): void
    {
        $u1 = new User();
        $u2 = new User();
        $u3 = new User();

        $u1->setOwner($u1);
        $u3->setOwner($u2);

        $this->expectExceptionMessage('This user owns other users, so he cannot himself be owned by somebody else');
        $u2->setOwner($u1);
    }

    public function testSetStatus(): void
    {
        $u1 = new User();
        $u2 = new User();

        // Initial status
        self::assertSame(User::STATUS_NEW, $u1->getStatus());
        self::assertSame(User::STATUS_NEW, $u2->getStatus());

        $u1->setOwner($u1);
        $u2->setOwner($u1);
        $u1->setStatus(User::STATUS_INACTIVE);

        // Status is propagated to existing users
        self::assertSame(User::STATUS_INACTIVE, $u1->getStatus());
        self::assertSame(User::STATUS_INACTIVE, $u2->getStatus());

        $u1->setStatus(user::STATUS_ACTIVE);
        self::assertSame(User::STATUS_ACTIVE, $u1->getStatus());
        self::assertSame(User::STATUS_ACTIVE, $u2->getStatus());

        // Status is propagated on new users too
        $u3 = new User();
        self::assertSame(User::STATUS_NEW, $u3->getStatus());
        $u3->setOwner($u1);
        self::assertSame(User::STATUS_ACTIVE, $u3->getStatus());
    }
}
