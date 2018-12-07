<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Bookable;
use Application\Model\License;
use Application\Model\User;
use PHPUnit\Framework\TestCase;

class LicenseTest extends TestCase
{
    public function testUserRelation(): void
    {
        $license = new License();
        self::assertCount(0, $license->getUsers(), 'license should have no users');

        $user = new User();
        self::assertCount(0, $user->getLicenses(), 'user should have no licenses');

        $license->addUser($user);
        self::assertCount(1, $user->getLicenses(), 'user should have the added license');
        self::assertSame($license, $user->getLicenses()->first(), 'user should have the same license');
        self::assertCount(1, $license->getUsers(), 'license should have the added user');
        self::assertSame($user, $license->getUsers()->first(), 'license should be able to retrieve added user');

        $license->addUser($user);
        self::assertCount(1, $user->getLicenses(), 'user should still have exactly 1 license');
        self::assertCount(1, $license->getUsers(), 'license should still have the same unique user');

        $user2 = new User();
        $license->addUser($user2);
        self::assertCount(2, $license->getUsers(), 'should be able to add second user');

        $license->removeUser($user);
        self::assertCount(0, $user->getLicenses(), 'user should not have any license anymore');
        self::assertCount(1, $license->getUsers(), 'license should be able to remove first user');
        self::assertSame($user2, $license->getUsers()->first(), 'license should have only the second user left');
    }

    public function testBookableRelation(): void
    {
        $license = new License();
        self::assertCount(0, $license->getBookables(), 'license should have no bookables');

        $bookable = new Bookable();
        self::assertCount(0, $bookable->getLicenses(), 'bookable should have no licenses');

        $license->addBookable($bookable);
        self::assertCount(1, $bookable->getLicenses(), 'bookable should have the added license');
        self::assertSame($license, $bookable->getLicenses()->first(), 'bookable should have the same license');
        self::assertCount(1, $license->getBookables(), 'license should have the added bookable');
        self::assertSame($bookable, $license->getBookables()->first(), 'license should be able to retrieve added bookable');

        $license->addBookable($bookable);
        self::assertCount(1, $bookable->getLicenses(), 'bookable should still have exactly 1 license');
        self::assertCount(1, $license->getBookables(), 'license should still have the same unique bookable');

        $bookable2 = new Bookable();
        $license->addBookable($bookable2);
        self::assertCount(2, $license->getBookables(), 'should be able to add second bookable');

        $license->removeBookable($bookable);
        self::assertCount(0, $bookable->getLicenses(), 'bookable should not have any license anymore');
        self::assertCount(1, $license->getBookables(), 'license should be able to remove first bookable');
        self::assertSame($bookable2, $license->getBookables()->first(), 'license should have only the second bookable left');
    }
}
