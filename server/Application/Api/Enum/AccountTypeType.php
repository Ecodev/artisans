<?php

declare(strict_types=1);

namespace Application\Api\Enum;

class AccountTypeType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            \Application\DBAL\Types\AccountTypeType::ASSET => 'actif',
            \Application\DBAL\Types\AccountTypeType::LIABILITY => 'passif',
            \Application\DBAL\Types\AccountTypeType::REVENUE => 'produit',
            \Application\DBAL\Types\AccountTypeType::EXPENSE => 'charge',
            \Application\DBAL\Types\AccountTypeType::EQUITY => 'résultat',
            \Application\DBAL\Types\AccountTypeType::GROUP => 'groupe',
        ];

        parent::__construct($config);
    }
}
