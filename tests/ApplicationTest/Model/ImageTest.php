<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Image;
use Application\Model\User;
use PHPUnit\Framework\TestCase;

class ImageTest extends TestCase
{
    public function tearDown(): void
    {
        User::setCurrent(null);
    }

    public function testGetPath(): void
    {
        $image = new Image();
        $image->setFilename('photo.jpg');

        self::assertSame('photo.jpg', $image->getFilename());
        $appPath = realpath('.');
        $expected = $appPath . '/data/images/photo.jpg';
        self::assertSame($expected, $image->getPath());
    }

    public function testCopyIntoWithoutFile(): void
    {
        $original = new Image();
        $original->setWidth(456);
        $original->setHeight(456);

        self::assertSame(456, $original->getWidth());
        self::assertSame(456, $original->getHeight());
    }

    public function testGetPermissions(): void
    {
        $image = new Image();
        $actual = $image->getPermissions();
        $expected = [
            'create' => false,
            'read' => true,
            'update' => false,
            'delete' => false,
        ];
        self::assertEquals($expected, $actual, 'should be able to get permissions as anonymous');

        // Make it the current user as creator
        $user = new User();
        User::setCurrent($user);
        $image->timestampCreation();

        $actual2 = $image->getPermissions();
        $expected2 = [
            'create' => false,
            'read' => true,
            'update' => false,
            'delete' => false,
        ];
        self::assertEquals($expected2, $actual2, 'should be able to get permissions as creator');
    }
}
