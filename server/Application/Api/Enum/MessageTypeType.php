<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class MessageTypeType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\MessageTypeType::REGISTER => 'Création de compte',
            \Application\DBAL\Types\MessageTypeType::CONFIRMED_REGISTRATION => 'Création de compte confirmée',
            \Application\DBAL\Types\MessageTypeType::UNREGISTER => 'Démission',
            \Application\DBAL\Types\MessageTypeType::RESET_PASSWORD => 'Changement de mot de passe',
            \Application\DBAL\Types\MessageTypeType::UPDATED_USER => 'Utilisateur modifié',
        ];

        parent::__construct($config);
    }
}
