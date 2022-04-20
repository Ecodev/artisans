<?php

declare(strict_types=1);

namespace Application\Handler;

use Application\Model\File;
use Doctrine\ORM\EntityManager;
use Ecodev\Felix\Handler\FileHandler;
use Psr\Container\ContainerInterface;

class FileFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $entityManager = $container->get(EntityManager::class);

        return new FileHandler($entityManager->getRepository(File::class));
    }
}
