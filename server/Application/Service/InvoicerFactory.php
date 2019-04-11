<?php

declare(strict_types=1);

namespace Application\Service;

use Doctrine\ORM\EntityManager;
use Interop\Container\ContainerInterface;

class InvoicerFactory
{
    /**
     * Return a configured invoicer
     *
     * @param ContainerInterface $container
     *
     * @return Invoicer
     */
    public function __invoke(ContainerInterface $container): Invoicer
    {
        $entityManager = $container->get(EntityManager::class);

        return new Invoicer($entityManager);
    }
}
