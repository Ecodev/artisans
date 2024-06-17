<?php

declare(strict_types=1);

namespace Application\Api\Field;

use Application\Api\Helper;
use Application\Model\AbstractModel;
use Application\Model\Order;
use Doctrine\ORM\Mapping\ClassMetadata;
use Ecodev\Felix\Api\Field\FieldInterface;
use Ecodev\Felix\Api\Input\PaginationInputType;
use Ecodev\Felix\Api\Plural;
use GraphQL\Type\Definition\Type;
use Money\Money;
use ReflectionClass;

/**
 * Provide easy way to build standard fields to query and mutate objects.
 *
 * @phpstan-import-type PermissiveFieldsConfig from FieldInterface
 */
abstract class Standard
{
    /**
     * Returns standard fields to query the object.
     *
     * @return PermissiveFieldsConfig
     */
    public static function buildQuery(string $class): iterable
    {
        $metadata = _em()->getClassMetadata($class);
        $reflect = $metadata->getReflectionClass();
        $name = lcfirst($reflect->getShortName());
        $shortName = $reflect->getShortName();
        $plural = Plural::make($name);

        $listArgs = self::getListArguments($metadata);
        $singleArgs = self::getSingleArguments($class);

        yield $plural => fn () => [
            'type' => Type::nonNull(_types()->get($shortName . 'Pagination')),
            'args' => $listArgs,
            'resolve' => function ($root, array $args) use ($class, $metadata): array {
                $filters = self::customTypesToScalar($args['filter'] ?? []);

                // If null or empty list is provided by client, fallback on default sorting
                $sorting = $args['sorting'] ?? [];
                if (!$sorting) {
                    $sorting = self::getDefaultSorting($metadata);
                }

                // And **always** sort by ID
                $sorting[] = [
                    'field' => 'id',
                    'order' => 'ASC',
                ];

                $qb = _types()->createFilteredQueryBuilder($class, $filters, $sorting);

                $items = Helper::paginate($args['pagination'], $qb);
                $aggregatedFields = Helper::aggregatedFields($class, $qb);
                $result = array_merge($aggregatedFields, $items);

                return $result;
            },
        ];

        yield $name => fn () => [
            'type' => Type::nonNull(_types()->getOutput($class)),
            'args' => $singleArgs,
            'resolve' => function ($root, array $args): ?AbstractModel {
                $object = $args['id']->getEntity();

                Helper::throwIfDenied($object, 'read');

                return $object;
            },
        ];
    }

    /**
     * Returns standard fields to mutate the object.
     *
     * @return PermissiveFieldsConfig
     */
    public static function buildMutation(string $class): iterable
    {
        $reflect = new ReflectionClass($class);
        $name = $reflect->getShortName();
        $plural = Plural::make($name);

        yield 'create' . $name => fn () => [
            'type' => Type::nonNull(_types()->getOutput($class)),
            'description' => 'Create a new ' . $name,
            'args' => [
                'input' => Type::nonNull(_types()->getInput($class)),
            ],
            'resolve' => function ($root, array $args) use ($class): AbstractModel {
                // Do it
                $object = new $class();
                $input = $args['input'];
                Helper::hydrate($object, $input);

                // Check ACL
                Helper::throwIfDenied($object, 'create');

                _em()->persist($object);
                _em()->flush();

                return $object;
            },
        ];

        yield 'update' . $name => fn () => [
            'type' => Type::nonNull(_types()->getOutput($class)),
            'description' => 'Update an existing ' . $name,
            'args' => [
                'id' => Type::nonNull(_types()->getId($class)),
                'input' => Type::nonNull(_types()->getPartialInput($class)),
            ],
            'resolve' => function ($root, array $args): AbstractModel {
                $object = $args['id']->getEntity();

                // Check ACL
                Helper::throwIfDenied($object, 'update');

                // Do it
                $input = $args['input'];
                Helper::hydrate($object, $input);

                _em()->flush();

                return $object;
            },
        ];

        yield 'delete' . $plural => fn () => [
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Delete one or several existing ' . $name,
            'args' => [
                'ids' => Type::nonNull(Type::listOf(Type::nonNull(_types()->getId($class)))),
            ],
            'resolve' => function ($root, array $args): bool {
                foreach ($args['ids'] as $id) {
                    $object = $id->getEntity();

                    // Check ACL
                    Helper::throwIfDenied($object, 'delete');

                    // Do it
                    _em()->remove($object);
                }

                _em()->flush();

                return true;
            },
        ];
    }

    /**
     * Returns standard mutations to manage many-to-many relations between two given class.
     *
     * @param string $ownerClass The class owning the relation
     * @param string $otherClass The other class, not-owning the relation
     * @param null|string $otherName a specific semantic, if needed, to be use as adder. If `$otherName = 'Parent'`, then we will call `addParent()`
     *
     * @return PermissiveFieldsConfig
     */
    public static function buildRelationMutation(string $ownerClass, string $otherClass, ?string $otherName = null): iterable
    {
        $ownerReflect = new ReflectionClass($ownerClass);
        $ownerName = $ownerReflect->getShortName();
        $lowerOwnerName = lcfirst($ownerName);

        $otherReflect = new ReflectionClass($otherClass);
        $otherClassName = $otherReflect->getShortName();
        if ($otherName) {
            $semantic = ' as ' . $otherName;
        } else {
            $semantic = '';
            $otherName = $otherClassName;
        }
        $lowerOtherName = lcfirst($otherName);

        if ($lowerOwnerName === $lowerOtherName) {
            $lowerOwnerName .= 1;
            $lowerOtherName .= 2;
        }

        $args = [
            $lowerOwnerName => Type::nonNull(_types()->getId($ownerClass)),
            $lowerOtherName => Type::nonNull(_types()->getId($otherClass)),
        ];

        yield 'link' . $ownerName . $otherName => fn () => [
            'type' => Type::nonNull(_types()->getOutput($ownerClass)),
            'description' => 'Create a relation between ' . $ownerName . ' and ' . $otherClassName . $semantic . '.' . PHP_EOL . PHP_EOL
                . 'If the relation already exists, it will have no effect.',
            'args' => $args,
            'resolve' => function ($root, array $args) use ($lowerOwnerName, $lowerOtherName, $otherName): AbstractModel {
                $owner = $args[$lowerOwnerName]->getEntity();
                $other = $args[$lowerOtherName]->getEntity();

                // Check ACL
                Helper::throwIfDenied($owner, 'update');

                // Do it
                $method = 'add' . $otherName;
                $owner->$method($other);
                _em()->flush();

                return $owner;
            },
        ];

        yield 'unlink' . $ownerName . $otherName => fn () => [
            'type' => Type::nonNull(_types()->getOutput($ownerClass)),
            'description' => 'Delete a relation between ' . $ownerName . ' and ' . $otherClassName . $semantic . '.' . PHP_EOL . PHP_EOL
                . 'If the relation does not exist, it will have no effect.',
            'args' => $args,
            'resolve' => function ($root, array $args) use ($lowerOwnerName, $lowerOtherName, $otherName): AbstractModel {
                $owner = $args[$lowerOwnerName]->getEntity();
                $other = $args[$lowerOtherName]->getEntity();

                // Check ACL
                Helper::throwIfDenied($owner, 'update');

                // Do it
                if ($other) {
                    $method = 'remove' . $otherName;
                    $owner->$method($other);
                    _em()->flush();
                }

                return $owner;
            },
        ];
    }

    /**
     * Return arguments used for the list.
     */
    private static function getListArguments(ClassMetadata $class): array
    {
        $listArgs = [
            [
                'name' => 'filter',
                'type' => _types()->getFilter($class->getName()),
            ],
            [
                'name' => 'sorting',
                'type' => _types()->getSorting($class->getName()),
                'defaultValue' => self::getDefaultSorting($class),
            ],
        ];

        $listArgs[] = PaginationInputType::build(_types());

        return $listArgs;
    }

    /**
     * Return arguments used for single item.
     */
    private static function getSingleArguments(string $class): array
    {
        $args = [
            'id' => Type::nonNull(_types()->getId($class)),
        ];

        return $args;
    }

    /**
     * Get default sorting values with some fallback for some special cases.
     */
    private static function getDefaultSorting(ClassMetadata $metadata): array
    {
        $defaultSorting = [];

        $class = $metadata->getName();
        if ($class === Order::class) {
            $defaultSorting[] = [
                'field' => 'creationDate',
                'order' => 'DESC',
            ];
        }

        return $defaultSorting;
    }

    /**
     * Recursively convert custom scalars that don't implement __toString() to their scalar
     * representation to injected back into DQL/SQL.
     */
    private static function customTypesToScalar(array $args): array
    {
        foreach ($args as &$p) {
            if (is_array($p)) {
                $p = self::customTypesToScalar($p);
            } elseif ($p instanceof Money) {
                $p = $p->getAmount();
            }
        }

        return $args;
    }
}
