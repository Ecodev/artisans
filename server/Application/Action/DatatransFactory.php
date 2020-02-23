<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Service\Mailer;
use Application\Service\MessageQueuer;
use Doctrine\ORM\EntityManager;
use Interop\Container\ContainerInterface;
use Mezzio\Template\TemplateRendererInterface;

class DatatransFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $entityManager = $container->get(EntityManager::class);
        $rendered = $container->get(TemplateRendererInterface::class);
        $config = $container->get('config');
        $mailer = $container->get(Mailer::class);
        $messageQueuer = $container->get(MessageQueuer::class);

        return new DatatransAction($entityManager, $rendered, $config['datatrans'], $mailer, $messageQueuer);
    }
}
