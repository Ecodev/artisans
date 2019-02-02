<?php

declare(strict_types=1);

namespace Application\Api;

use Doctrine\ORM\EntityManager;
use GraphQL\Doctrine\Types;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\ServiceManager;

class TypesFactory
{
    public function __invoke(ContainerInterface $container): Types
    {
        $entityManager = $container->get(EntityManager::class);

        $invokables = [
            \Application\Api\Enum\UserStatusType::class,
            \Application\Api\Enum\UserRoleType::class,
            \Application\Api\Enum\BookableStateType::class,
            \Application\Api\Enum\BookingStatusType::class,
            \Application\Api\Enum\BookingTypeType::class,
            \Application\Api\Enum\SexType::class,
            \Application\Api\Enum\RelationshipType::class,
            \Application\Api\Enum\BillingTypeType::class,
            \Application\Api\Enum\DoorType::class,
            \Application\Api\Enum\ExpenseClaimStatusType::class,
            \Application\Api\Enum\MessageTypeType::class,
            \Application\Api\Input\ConfirmRegistrationInputType::class,
            \Application\Api\Input\PaginationInputType::class,
            \Application\Api\MutationType::class,
            \Application\Api\Output\GlobalPermissionsListType::class,
            \Application\Api\Output\GlobalPermissionsType::class,
            \Application\Api\Output\OpenDoorType::class,
            \Application\Api\Output\PermissionsType::class,
            \Application\Api\QueryType::class,
            \Application\Api\Scalar\ColorType::class,
            \Application\Api\Scalar\ChronosType::class,
            \Application\Api\Scalar\DateType::class,
            \Application\Api\Scalar\EmailType::class,
            \Application\Api\Scalar\LoginType::class,
            \Application\Api\Scalar\PasswordType::class,
            \Application\Api\Scalar\TokenType::class,
            \GraphQL\Upload\UploadType::class,
        ];

        $aliases = [
            'datetime' => \Application\Api\Scalar\ChronosType::class,
            'date' => \Application\Api\Scalar\DateType::class,
            'UploadedFileInterface' => \GraphQL\Upload\UploadType::class,
        ];

        // Automatically add aliases for GraphQL type name from the invokable types
        foreach ($invokables as $type) {
            $parts = explode('\\', $type);
            $alias = preg_replace('~Type$~', '', end($parts));
            $aliases[$alias] = $type;
        }

        $customTypes = new ServiceManager([
            'invokables' => $invokables,
            'aliases' => $aliases,
            'services' => [
//                // This is not quite right because it allow to compare a string with a json array.
//                // TODO: either hide the json_array filter or find a cleaner solution
//                'json_array' => GraphQL\Type\Definition\Type::string(),
            ],
            'abstract_factories' => [
                \Application\Api\Output\PaginationTypeFactory::class,
            ],
        ]);

        $types = new Types($entityManager, $customTypes);

        return $types;
    }
}
