<?php

declare(strict_types=1);

return [
    'doctrine' => [
        'connection' => [
            'orm_default' => [
                'driverClass' => Doctrine\DBAL\Driver\PDOMySql\Driver::class,
                'params' => [
                    'host' => 'localhost',
                    'dbname' => 'ichtus',
                    'user' => 'ichtus',
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
        'configuration' => [
            'orm_default' => [
                'naming_strategy' => \Doctrine\ORM\Mapping\UnderscoreNamingStrategy::class,
                'proxy_dir' => 'data/cache/DoctrineORMModule/Proxy',
                'generate_proxies' => false,
                'filters' => [
                    \Application\ORM\Query\Filter\AclFilter::class => \Application\ORM\Query\Filter\AclFilter::class,
                ],
            ],
        ],
        'types' => [
            'UserRole' => Application\DBAL\Types\UserRoleType::class,
            'BookingType' => Application\DBAL\Types\BookingTypeType::class,
            'BookingStatus' => Application\DBAL\Types\BookingStatusType::class,
            'Relationship' => Application\DBAL\Types\RelationshipType::class,
            'BillingType' => Application\DBAL\Types\BillingTypeType::class,
            'datetime' => Application\DBAL\Types\ChronosType::class,
            'date' => Application\DBAL\Types\DateType::class,
            'ExpenseClaimStatus' => Application\DBAL\Types\ExpenseClaimStatusType::class,
            'MessageType' => Application\DBAL\Types\MessageTypeType::class,
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
