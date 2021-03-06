<?php

declare(strict_types=1);

return [
    'doctrine' => [
        'connection' => [
            'orm_default' => [
                'driverClass' => Doctrine\DBAL\Driver\PDOMySql\Driver::class,
                'params' => [
                    'host' => 'localhost',
                    'dbname' => 'artisans',
                    'user' => 'artisans',
                    'password' => '',
                    'port' => 3306,
                    'driverOptions' => [
                        \PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8mb4',
                    ],
                    'defaultTableOptions' => [
                        'charset' => 'utf8mb4',
                        'collate' => 'utf8mb4_unicode_ci',
                    ],
                ],
            ],
        ],
        'driver' => [
            'orm_default' => [
                'class' => Doctrine\ORM\Mapping\Driver\AnnotationDriver::class,
                'cache' => 'array',
                'paths' => ['server/Application/Model'],
            ],
        ],
        'event_manager' => [
            'orm_default' => [
                'subscribers' => [
                ],
            ],
        ],
        'configuration' => [
            'orm_default' => [
                'naming_strategy' => \Doctrine\ORM\Mapping\UnderscoreNamingStrategy::class,
                'proxy_dir' => 'data/cache/DoctrineORMModule/Proxy',
                'generate_proxies' => false,
                'filters' => [
                    \Ecodev\Felix\ORM\Query\Filter\AclFilter::class => \Ecodev\Felix\ORM\Query\Filter\AclFilter::class,
                ],
                'datetime_functions' => [],
                'string_functions' => [
                    'greatest' => \DoctrineExtensions\Query\Mysql\Greatest::class,
                    'if' => \DoctrineExtensions\Query\Mysql\IfElse::class,
                    'ifnull' => \DoctrineExtensions\Query\Mysql\IfNull::class,
                    'find_in_set' => \DoctrineExtensions\Query\Mysql\FindInSet::class,
                ],
                'numeric_functions' => [],
            ],
        ],
        'types' => [
            'UserRole' => Application\DBAL\Types\UserRoleType::class,
            'datetime' => Ecodev\Felix\DBAL\Types\ChronosType::class,
            'date' => Ecodev\Felix\DBAL\Types\DateType::class,
            'CHF' => Ecodev\Felix\DBAL\Types\CHFType::class,
            'EUR' => Ecodev\Felix\DBAL\Types\EURType::class,
            'MessageType' => Application\DBAL\Types\MessageTypeType::class,
            'ProductType' => Application\DBAL\Types\ProductTypeType::class,
            'OrderStatus' => Application\DBAL\Types\OrderStatusType::class,
            'PaymentMethod' => Application\DBAL\Types\PaymentMethodType::class,
            'Membership' => Application\DBAL\Types\MembershipType::class,
        ],
        // migrations configuration
        'migrations_configuration' => [
            'orm_default' => [
                'directory' => 'server/Application/Migration',
                'namespace' => 'Application\Migration',
            ],
        ],
    ],
];
