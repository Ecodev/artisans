<?php

declare(strict_types=1);

return [
    // Provides application-wide services.
    // We recommend using fully-qualified class names whenever possible as
    // service names.
    'dependencies' => [
        // Use 'invokables' for constructor-less services, or services that do
        // not require arguments to the constructor. Map a service name to the
        // class name.
        'invokables' => [
            Doctrine\ORM\Mapping\UnderscoreNamingStrategy::class => Doctrine\ORM\Mapping\UnderscoreNamingStrategy::class,
            Application\Handler\DownloadFile::class => Application\Handler\DownloadFile::class,
            Application\Handler\DownloadCounter::class => Application\Handler\DownloadCounter::class,
        ],
        // Use 'factories' for services provided by callbacks/factory classes.
        'factories' => [
            'doctrine.entity_manager.orm_default' => Application\ORM\EntityManagerFactory::class,
            Application\Handler\DatatransHandler::class => Application\Handler\DatatransFactory::class,
            Application\Middleware\AuthenticationMiddleware::class => Application\Middleware\AuthenticationFactory::class,
            Application\Service\Invoicer::class => Application\Service\InvoicerFactory::class,
            Application\Service\MessageQueuer::class => Application\Service\MessageQueuerFactory::class,
            Ecodev\Felix\Handler\FileHandler::class => Application\Handler\FileFactory::class,
            Ecodev\Felix\Handler\GraphQLHandler::class => Application\Handler\GraphQLFactory::class,
            Ecodev\Felix\Handler\ImageHandler::class => Application\Handler\ImageFactory::class,
            Ecodev\Felix\Service\Mailer::class => Application\Service\MailerFactory::class,
            GraphQL\Doctrine\Types::class => Application\Api\TypesFactory::class,
            Application\Handler\SitemapHandler::class => Application\Handler\SitemapFactory::class,
        ],
    ],
];
