<?php

declare(strict_types=1);

use Doctrine\ORM\EntityManager;
use Zend\ServiceManager\ServiceManager;

// Load configuration
$config = require __DIR__ . '/config.php';

$dependencies = $config['dependencies'];
$dependencies['services']['config'] = $config;

// Build container
global $container;
$container = new ServiceManager($dependencies);

/**
 * Returns the EM
 *
 * @return EntityManager
 */
function _em(): EntityManager
{
    global $container;

    return $container->get(EntityManager::class);
}

return $container;
