<?php

declare(strict_types=1);

namespace ApplicationTest\Acl;

use Application\Acl\ModelResource;
use Application\Model\User;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

class ModelResourceTest extends TestCase
{
    public function testConstructorVariants(): void
    {
        // Constructor with pre-loaded model
        $user = new User();
        $resource = new ModelResource(User::class, $user);
        self::assertSame($user, $resource->getInstance(), 'should be able to get back model');
        self::assertSame('User#', $resource->getName(), 'should have unique name');
    }

    public function testUnknownClassMustThrow(): void
    {
        $this->expectException(InvalidArgumentException::class);

        new ModelResource('non-existing-class-name');
    }
}
