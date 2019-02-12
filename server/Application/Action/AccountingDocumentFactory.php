<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Model\AccountingDocument;
use Doctrine\ORM\EntityManager;
use Interop\Container\ContainerInterface;

class AccountingDocumentFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $entityManager = $container->get(EntityManager::class);

        return new AccountingDocumentAction($entityManager->getRepository(AccountingDocument::class));
    }
}
