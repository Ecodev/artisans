<?php

declare(strict_types=1);

namespace ApplicationTest\Handler;

use Application\Handler\HomePageHandler;
use Application\Handler\HomePageHandlerFactory;
use Doctrine\ORM\EntityManager;
use PHPUnit\Framework\TestCase;
use Prophecy\Prophecy\ObjectProphecy;
use Psr\Container\ContainerInterface;
use Zend\Expressive\Template\TemplateRendererInterface;

class HomePageHandlerFactoryTest extends TestCase
{
    /** @var ContainerInterface|ObjectProphecy */
    protected $container;

    protected function setUp(): void
    {
        $this->container = $this->prophesize(ContainerInterface::class);
        $em = $this->prophesize(EntityManager::class);

        $this->container->get(EntityManager::class)->willReturn($em);
    }

    public function testFactoryWithoutTemplate(): void
    {
        $factory = new HomePageHandlerFactory();
        $this->container->has(TemplateRendererInterface::class)->willReturn(false);

        $this->assertInstanceOf(HomePageHandlerFactory::class, $factory);

        $homePage = $factory($this->container->reveal());

        $this->assertInstanceOf(HomePageHandler::class, $homePage);
    }
}
