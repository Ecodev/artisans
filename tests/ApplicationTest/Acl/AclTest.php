<?php

declare(strict_types=1);

namespace ApplicationTest\Acl;

use Application\Acl\Acl;
use Application\Model\User;
use PHPUnit\Framework\TestCase;

class AclTest extends TestCase
{
    public function testIsCurrentUserAllowed(): void
    {
        $acl = new Acl();
        $user = new User();

        $ownerMember = new User();
        $ownerMember->setName('Sarah');
        User::setCurrent($ownerMember);
        $user->timestampCreation();

        User::setCurrent(null);
        self::assertFalse($acl->isCurrentUserAllowed($user, 'update'), 'anonymous cannot update');
        self::assertSame('Non-logged user with role anonymous is not allowed on resource "User#" with privilege "update"', $acl->getLastDenialMessage());

        User::setCurrent($ownerMember);
        self::assertFalse($acl->isCurrentUserAllowed($user, 'update'), 'student cannot update even if owner');
        self::assertSame('User "Sarah" with role member is not allowed on resource "User#" with privilege "update"', $acl->getLastDenialMessage());

        $otherMember = new User();
        $otherMember->setName('John');
        User::setCurrent($otherMember);
        self::assertFalse($acl->isCurrentUserAllowed($user, 'update'), 'other user cannot update');
        self::assertSame('User "John" with role member is not allowed on resource "User#" with privilege "update"', $acl->getLastDenialMessage());

        $administrator = new User(User::ROLE_ADMINISTRATOR);
        $administrator->setName('Jane');
        User::setCurrent($administrator);
        self::assertTrue($acl->isCurrentUserAllowed($user, 'update'), 'admin can do anything');
        self::assertNull($acl->getLastDenialMessage());
    }
}
