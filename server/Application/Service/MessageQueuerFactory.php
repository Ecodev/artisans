<?php

declare(strict_types=1);

namespace Application\Service;

use Doctrine\ORM\EntityManager;
use Ecodev\Felix\Service\MessageRenderer;
use Psr\Container\ContainerInterface;

class MessageQueuerFactory
{
    /**
     * Return a configured mailer.
     */
    public function __invoke(ContainerInterface $container): MessageQueuer
    {
        $entityManager = $container->get(EntityManager::class);
        $renderer = $container->get(MessageRenderer::class);
        $config = $container->get('config');

        return new MessageQueuer(
            $entityManager,
            $renderer,
            $config,
        );
    }
}
