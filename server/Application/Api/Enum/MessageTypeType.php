<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class MessageTypeType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\MessageTypeType::MONTLY_REMINDER => 'rappel mensuel',
            \Application\DBAL\Types\MessageTypeType::YEARLY_REMINDER => 'rappel annuel',
        ];

        parent::__construct($config);
    }
}
