<?php

declare(strict_types=1);

namespace Application\Service;

use Doctrine\ORM\EntityManager;
use Interop\Container\ContainerInterface;
use Zend\Mail\Transport\TransportInterface;
use Zend\View\Renderer\RendererInterface;

class MailerFactory
{
    /**
     * Return a configured mailer
     *
     * @param ContainerInterface $container
     *
     * @return Mailer
     */
    public function __invoke(ContainerInterface $container): Mailer
    {
        $entityManager = $container->get(EntityManager::class);
        $renderer = $container->get(RendererInterface::class);
        $transport = $container->get(TransportInterface::class);
        $config = $container->get('config');

        return new Mailer(
            $entityManager,
            $transport,
            $renderer,
            $config['hostname'],
            $config['emailOverride'] ?? null,
            $config['fromEmail'],
            $config['phpPath']
        );
    }
}
