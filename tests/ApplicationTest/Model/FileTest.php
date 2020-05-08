<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\File;
use Application\Model\User;
use PHPUnit\Framework\TestCase;

class FileTest extends TestCase
{
    public function setUp(): void
    {
        User::setCurrent(null);
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
