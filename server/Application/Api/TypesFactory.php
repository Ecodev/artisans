<?php

declare(strict_types=1);

namespace Application\Api;

use Doctrine\ORM\EntityManager;
use GraphQL\Doctrine\Types;
use Laminas\ServiceManager\ServiceManager;
use Psr\Container\ContainerInterface;

class TypesFactory
{
    public function __invoke(ContainerInterface $container): Types
    {
        $entityManager = $container->get(EntityManager::class);

        $invokables = [
            \Application\Api\Enum\UserRoleType::class,
            \Application\Api\Enum\MessageTypeType::class,
            \Application\Api\Enum\PaymentMethodType::class,
            \Application\Api\Enum\MembershipType::class,
            \Application\Api\Enum\ProductTypeType::class,
            \Application\Api\Enum\OrderStatusType::class,
            \Application\Api\Input\ConfirmRegistrationInputType::class,
            \Ecodev\Felix\Api\Input\PaginationInputType::class,
            \Application\Api\Input\OrderLineInputType::class,
            \Application\Api\Input\OrderInputType::class,
            \Application\Api\MutationType::class,
            \Application\Api\Output\AllPermissionsType::class,
            \Application\Api\Output\ImportResultType::class,
            \Application\Api\Output\CrudPermissionsListType::class,
            \Application\Api\Output\CrudPermissionsType::class,
            \Ecodev\Felix\Api\Output\PermissionsType::class,
            \Application\Api\QueryType::class,
            \Ecodev\Felix\Api\Scalar\ColorType::class,
            \Ecodev\Felix\Api\Scalar\ChronosType::class,
            \Ecodev\Felix\Api\Scalar\DateType::class,
            \Ecodev\Felix\Api\Scalar\CHFType::class,
            \Ecodev\Felix\Api\Scalar\EURType::class,
            \Ecodev\Felix\Api\Scalar\EmailType::class,
            \Ecodev\Felix\Api\Scalar\PasswordType::class,
            \Ecodev\Felix\Api\Scalar\TokenType::class,
            \GraphQL\Upload\UploadType::class,
        ];

        $invokables = array_combine($invokables, $invokables);

        $aliases = [
            \Cake\Chronos\Chronos::class => \Ecodev\Felix\Api\Scalar\ChronosType::class,
            \Cake\Chronos\ChronosDate::class => \Ecodev\Felix\Api\Scalar\DateType::class,
            'datetime' => \Ecodev\Felix\Api\Scalar\ChronosType::class,
            'date' => \Ecodev\Felix\Api\Scalar\DateType::class,
            \Psr\Http\Message\UploadedFileInterface::class => \GraphQL\Upload\UploadType::class,
            'UploadedFileInterface' => \GraphQL\Upload\UploadType::class,
            'CHF' => \Ecodev\Felix\Api\Scalar\CHFType::class,
            'EUR' => \Ecodev\Felix\Api\Scalar\EURType::class,
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
                'json' => \GraphQL\Type\Definition\Type::string(),
            ],
            'abstract_factories' => [
                \Application\Api\Output\PaginationTypeFactory::class,
            ],
        ]);

        $types = new Types($entityManager, $customTypes);

        return $types;
    }
}
