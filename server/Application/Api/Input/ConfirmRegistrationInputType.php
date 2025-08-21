<?php

declare(strict_types=1);

namespace Application\Api\Input;

use Application\Model\Country;
use Ecodev\Felix\Api\Scalar\PasswordType;
use GraphQL\Type\Definition\InputObjectType;

class ConfirmRegistrationInputType extends InputObjectType
{
    public function __construct()
    {
        $config = [
            'description' => 'Mandatory fields to complete a user registration',
            'fields' => fn (): array => [
                'password' => [
                    'type' => self::nonNull(_types()->get(PasswordType::class)),
                ],
                'firstName' => [
                    'type' => self::nonNull(self::string()),
                ],
                'lastName' => [
                    'type' => self::nonNull(self::string()),
                ],
                'street' => [
                    'type' => self::nonNull(self::string()),
                ],
                'postcode' => [
                    'type' => self::nonNull(self::string()),
                ],
                'locality' => [
                    'type' => self::nonNull(self::string()),
                ],
                'country' => [
                    'type' => self::nonNull(_types()->getId(Country::class)),
                ],
            ],
        ];

        parent::__construct($config);
    }
}
