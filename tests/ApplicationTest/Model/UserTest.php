<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Bookable;
use Application\Model\User;
use Cake\Chronos\Chronos;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    public function tearDown(): void
    {
        User::setCurrent(null);
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

    public function providerSetRole(): array
    {
        return [
            [User::ROLE_ANONYMOUS, User::ROLE_ADMINISTRATOR, User::ROLE_MEMBER, 'anonymous is not allowed to change role from administrator to member'],
            [User::ROLE_ANONYMOUS, User::ROLE_MEMBER, User::ROLE_ADMINISTRATOR, 'anonymous is not allowed to change role from member to administrator'],

            [User::ROLE_MEMBER, User::ROLE_MEMBER, User::ROLE_MEMBER, null],
            [User::ROLE_MEMBER, User::ROLE_MEMBER, User::ROLE_ADMINISTRATOR, 'member is not allowed to change role from member to administrator'],

            [User::ROLE_ADMINISTRATOR, User::ROLE_MEMBER, User::ROLE_ADMINISTRATOR, null],
            [User::ROLE_ADMINISTRATOR, User::ROLE_ADMINISTRATOR, User::ROLE_MEMBER, null],
        ];
    }

    public function testSetPassword(): void
    {
        $user = new User();
        self::assertSame('', $user->getPassword(), 'should have no password at first');

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

        $subject = new Bookable();
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

        // Status 'archived' sets resign date
        Chronos::setTestNow((new Chronos()));
        $u1->setStatus(User::STATUS_ARCHIVED);
        self::assertTrue($u1->getResignDate() && $u1->getResignDate()->isToday());
    }

    public function testToken(): void
    {
        $user = new User();
        self::assertFalse($user->isTokenValid(), 'new user should not be valid');

        $token1 = $user->createToken();
        self::assertEquals(32, mb_strlen($token1), 'must be exactly the length of DB field');
        self::assertTrue($user->isTokenValid(), 'brand new token is valid');

        $token2 = $user->createToken();
        self::assertEquals(32, mb_strlen($token2), 'must be exactly the length of DB field');
        self::assertTrue($user->isTokenValid(), 'second created token is valid');

        $user->revokeToken();
        self::assertFalse($user->isTokenValid(), 'once user is logged in token is invalid');

        $token3 = $user->createToken();
        self::assertEquals(32, mb_strlen($token3), 'must be exactly the length of DB field');
        self::assertTrue($user->isTokenValid(), 'third created token is valid');

        $user->setStatus(User::STATUS_ACTIVE);
        self::assertFalse($user->isTokenValid(), 'once user is activated token is invalid');

        $token4 = $user->createToken();
        self::assertEquals(32, mb_strlen($token4), 'must be exactly the length of DB field');
        self::assertTrue($user->isTokenValid(), 'third created token is valid');

        $user->setPassword('money');
        self::assertFalse($user->isTokenValid(), 'after password change token is invalid');

        Chronos::setTestNow((new Chronos())->subDay(1));
        $token5 = $user->createToken();
        Chronos::setTestNow(null);
        self::assertEquals(32, mb_strlen($token5), 'must be exactly the length of DB field');
        self::assertFalse($user->isTokenValid(), 'too old token is invalid');

        $allTokens = [
            $token1,
            $token2,
            $token3,
            $token4,
            $token5,
        ];

        self::assertCount(5, array_unique($allTokens), 'all tokens must be unique');
    }

    public function providerCanOpenDoor(): array
    {
        return [
            'anonymous cannot open' => [
                User::ROLE_ANONYMOUS,
                User::STATUS_ACTIVE,
                ['door1' => true, 'door2' => true, 'door3' => true, 'door4' => true],
                ['door1' => false, 'door2' => false, 'door3' => false, 'door4' => false],
            ],
            'individual member can open' => [
                User::ROLE_INDIVIDUAL,
                User::STATUS_ACTIVE,
                ['door1' => true, 'door2' => true, 'door3' => true, 'door4' => false],
                ['door1' => true, 'door2' => true, 'door3' => true, 'door4' => false],
            ],
            'active member can open' => [
                User::ROLE_MEMBER,
                User::STATUS_ACTIVE,
                ['door1' => true, 'door2' => true, 'door3' => true, 'door4' => false],
                ['door1' => true, 'door2' => true, 'door3' => true, 'door4' => false],
            ],
            'inactive member cannot open' => [
                User::ROLE_MEMBER,
                User::STATUS_INACTIVE,
                ['door1' => true, 'door2' => true, 'door3' => true, 'door4' => false],
                ['door1' => false, 'door2' => false, 'door3' => false, 'door4' => false],
            ],
            'responsible can open' => [
                User::ROLE_RESPONSIBLE,
                User::STATUS_ACTIVE,
                ['door1' => true, 'door2' => true, 'door3' => true, 'door4' => true],
                ['door1' => true, 'door2' => true, 'door3' => true, 'door4' => true],
            ],
            'administrator can open' => [
                User::ROLE_ADMINISTRATOR,
                User::STATUS_ACTIVE,
                ['door1' => true, 'door2' => true, 'door3' => true, 'door4' => true],
                ['door1' => true, 'door2' => true, 'door3' => true, 'door4' => true],
            ],
        ];
    }

    /**
     * @dataProvider providerCanOpenDoor,
     *
     * @param string $role
     * @param string $status
     * @param array $doors
     * @param array $result
     */
    public function testCanOpenDoor(string $role, string $status, array $doors, array $result): void
    {
        $user = new User($role);
        $user->setStatus($status);
        foreach ($doors as $door => $value) {
            $setter = 'set' . ucfirst($door);
            $user->$setter($value);
        }

        foreach ($result as $door => $canOpen) {
            self::assertSame($canOpen, $user->getCanOpenDoor($door));
        }
    }
}
