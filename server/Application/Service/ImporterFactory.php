<?php

declare(strict_types=1);

namespace Application\Service;

use Doctrine\ORM\EntityManager;
use Interop\Container\ContainerInterface;

class ImporterFactory
{
    /**
     * Return a configured importer
     *
     * @param ContainerInterface $container
     *
     * @return Importer
     */
    public function __invoke(ContainerInterface $container): Importer
    {
        $entityManager = $container->get(EntityManager::class);

        return new Importer($container, $entityManager);
    }
}
