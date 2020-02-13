<?php

declare(strict_types=1);

namespace ApplicationTest;

use Application\Model\User;
use Application\Utility;
use GraphQL\Doctrine\Definition\EntityID;

class UtilityTest extends \PHPUnit\Framework\TestCase
{
    public function testNow(): void
    {
        self::assertStringStartsWith('202', Utility::getNow()->format('c'));
    }

    public function testGetShortClassName(): void
    {
        self::assertSame('User', Utility::getShortClassName(new User()));
    }

    public function testModelToId(): void
    {
        $input = [
            3 => new \stdClass(),
            4 => 1,
            'model' => new User(),
            'entity' => new class() extends EntityID {
                public function __construct()
                {
                }

                public function getEntity()
                {
                    return 'real entity';
                }
            },
        ];

        $actual = Utility::entityIdToModel($input);

        $expected = $input;
        $expected['entity'] = 'real entity';

        self::assertSame($expected, $actual, 'keys and non model values should be preserved');
        self::assertNull(Utility::entityIdToModel(null));
        self::assertSame([], Utility::entityIdToModel([]));
    }
}
