<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\User;
use Application\Model\UserTag;
use PHPUnit\Framework\TestCase;

class UserTagTest extends TestCase
{
    public function testUserRelation(): void
    {
        $userTag = new UserTag();
        self::assertCount(0, $userTag->getUsers(), 'userTag should have no users');

        $user = new User();
        self::assertCount(0, $user->getUserTags(), 'user should have no userTags');

        $userTag->addUser($user);
        self::assertCount(1, $user->getUserTags(), 'user should have the added userTag');
        self::assertSame($userTag, $user->getUserTags()->first(), 'user should have the same userTag');
        self::assertCount(1, $userTag->getUsers(), 'userTag should have the added user');
        self::assertSame($user, $userTag->getUsers()->first(), 'userTag should be able to retrieve added user');

        $userTag->addUser($user);
        self::assertCount(1, $user->getUserTags(), 'user should still have exactly 1 userTag');
        self::assertCount(1, $userTag->getUsers(), 'userTag should still have the same unique user');

        $user2 = new User();
        $userTag->addUser($user2);
        self::assertCount(2, $userTag->getUsers(), 'should be able to add second user');

        $userTag->removeUser($user);
        self::assertCount(0, $user->getUserTags(), 'user should not have any userTag anymore');
        self::assertCount(1, $userTag->getUsers(), 'userTag should be able to remove first user');
        self::assertSame($user2, $userTag->getUsers()->first(), 'userTag should have only the second user left');
    }
}
