<?php

declare(strict_types=1);

namespace Application\Api\Output;

use GraphQL\Type\Definition\ObjectType;

class OpenDoorType extends ObjectType
{
    public function __construct()
    {
        $config = [
            'name' => 'OpenDoor',
            'description' => 'Result of a door opening',
            'fields' => [
                'message' => [
                    'type' => self::nonNull(self::string()),
                    'description' => 'A message that can be displayed to the user',
                ],
                'timer' => [
                    'type' => self::nonNull(self::int()),
                    'description' => 'The number of seconds the door is opened',
                ],
            ],
        ];

        parent::__construct($config);
    }
}
