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
            \Application\DBAL\Types\MessageTypeType::USER_PENDING_ORDER => 'Commande en attente',
            \Application\DBAL\Types\MessageTypeType::USER_VALIDATED_ORDER => 'Commande validée',
            \Application\DBAL\Types\MessageTypeType::ADMIN_PENDING_ORDER => 'Commande a besoin de BVR',
            \Application\DBAL\Types\MessageTypeType::ADMIN_VALIDATED_ORDER => 'Commande doit être comptabilisée',
            \Application\DBAL\Types\MessageTypeType::REQUEST_MEMBERSHIP_END => 'Demande d\'arrêt de cotisations',
            \Application\DBAL\Types\MessageTypeType::NEWSLETTER_SUBSCRIPTION => 'Demande d\'inscription à la newsletter',
        ];

        parent::__construct($config);
    }
}
