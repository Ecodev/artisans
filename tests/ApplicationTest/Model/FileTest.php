<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\File;
use Application\Model\User;
use PHPUnit\Framework\TestCase;

class FileTest extends TestCase
{
    public function tearDown(): void
    {
        User::setCurrent(null);
    }

    public function testGetPath(): void
    {
        $file = new File();
        $file->setFilename('invoice.pdf');

        self::assertSame('invoice.pdf', $file->getFilename());
        $appPath = realpath('.');
        $expected = $appPath . '/data/file/invoice.pdf';
        self::assertSame($expected, $file->getPath());
    }

    public function testGetPermissions(): void
    {
        $file = new File();

        $actual = $file->getPermissions();
        $expected = [
            'create' => false,
            'read' => false,
            'update' => false,
            'delete' => false,
        ];
        self::assertEquals($expected, $actual, 'should be able to get permissions as anonymous');
    }
}
