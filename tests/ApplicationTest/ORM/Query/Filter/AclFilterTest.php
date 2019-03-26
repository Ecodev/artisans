<?php

declare(strict_types=1);

namespace ApplicationTest\ORM\Query\Filter;

use Application\Model\License;
use Application\Model\User;

use Application\ORM\Query\Filter\AclFilter;
use PHPUnit\Framework\TestCase;

class AclFilterTest extends TestCase
{
    public function providerFilter(): array
    {
        return [
            'tag is a totally public class, access everything' => [
                null,
                License::class,
                '',
            ],
            'users are invisible to anonymous' => [
                null,
                User::class,
                'test.id IN (-1)',
            ],
            'users are accessible to any other users' => [
                'member',
                User::class,
                'test.id IN (SELECT',
            ],
        ];
    }

    /**
     * @dataProvider providerFilter
     *
     * @param null|string $login
     * @param string $class
     * @param string $expected
     */
    public function testFilter(?string $login, string $class, string $expected): void
    {
        $user = _em()->getRepository(User::class)->getByLogin($login);
        $filter = new AclFilter(_em());
        $filter->setUser($user);
        $targetEntity = _em()->getMetadataFactory()->getMetadataFor($class);
        $actual = $filter->addFilterConstraint($targetEntity, 'test');

        if ($expected === '') {
            self::assertSame($expected, $actual);
        } else {
            self::assertStringStartsWith($expected, $actual);
        }
    }

    public function testDeactivable(): void
    {
        $user = new User();
        $filter = new AclFilter(_em());
        $filter->setUser($user);
        $targetEntity = _em()->getMetadataFactory()->getMetadataFor(User::class);

        $this->assertNotSame('', $filter->addFilterConstraint($targetEntity, 'test'));

        $filter->setEnabled(false);
        $this->assertSame('', $filter->addFilterConstraint($targetEntity, 'test'));

        $filter->setEnabled(true);
        $this->assertNotSame('', $filter->addFilterConstraint($targetEntity, 'test'));
    }
}
