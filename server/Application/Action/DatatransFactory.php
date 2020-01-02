<?php

declare(strict_types=1);

namespace Application\Action;

use Doctrine\ORM\EntityManager;
use Interop\Container\ContainerInterface;
use Mezzio\Template\TemplateRendererInterface;

class DatatransFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $entityManager = $container->get(EntityManager::class);
        $rendered = $container->get(TemplateRendererInterface::class);

        return new DatatransAction($entityManager, $rendered);
    }
}
