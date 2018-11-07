<?php

declare(strict_types=1);

namespace Application\Handler;

use Doctrine\ORM\EntityManager;
use Psr\Container\ContainerInterface;
use Psr\Http\Server\RequestHandlerInterface;

class HomePageHandlerFactory
{
    public function __invoke(ContainerInterface $container): RequestHandlerInterface
    {
        $entityManager = $container->get(EntityManager::class);

        return new HomePageHandler($entityManager);
    }
}
