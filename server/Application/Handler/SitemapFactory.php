<?php

declare(strict_types=1);

namespace Application\Handler;

use Application\Model\News;
use Application\Model\Product;
use Doctrine\ORM\EntityManager;
use Psr\Container\ContainerInterface;

class SitemapFactory
{
    public function __invoke(ContainerInterface $container): SitemapHandler
    {
        $config = $container->get('config');
        $entityManager = $container->get(EntityManager::class);
        $productRepository = $entityManager->getRepository(Product::class);
        $newsRepository = $entityManager->getRepository(News::class);

        return new SitemapHandler($productRepository, $newsRepository, $config['baseUrl'], $config['sitemapStaticPages']);
    }
}
