<?php

declare(strict_types=1);

namespace Application\Service;

use Interop\Container\ContainerInterface;
use Zend\Mail\Transport\InMemory;
use Zend\Mail\Transport\Smtp;
use Zend\Mail\Transport\SmtpOptions;
use Zend\Mail\Transport\TransportInterface;

class TransportFactory
{
    /**
     * Return a configured mail transport
     *
     * @param ContainerInterface $container
     *
     * @return TransportInterface
     */
    public function __invoke(ContainerInterface $container): TransportInterface
    {
        $config = $container->get('config');

        // Setup SMTP transport, or a mock one
        $configSmtp = $config['smtp'] ?? null;
        if ($configSmtp) {
            $transport = new Smtp();
            $options = new SmtpOptions($config['smtp']);
            $transport->setOptions($options);
        } else {
            $transport = new InMemory();
        }

        return $transport;
    }
}
