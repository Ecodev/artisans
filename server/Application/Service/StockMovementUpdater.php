<?php

declare(strict_types=1);

namespace Application\Service;

use Application\Model\AbstractModel;
use Application\Model\Product;
use Application\Model\StockMovement;
use Doctrine\Common\EventSubscriber;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Event\OnFlushEventArgs;
use Doctrine\ORM\Event\PostFlushEventArgs;
use Doctrine\ORM\Events;
use Doctrine\ORM\UnitOfWork;

/**
 * Automatically keep stock movement and product quantity up to date
 */
class StockMovementUpdater implements EventSubscriber
{
    /**
     * @var Product[] update queries and their params to be executed
     */
    private $products = [];

    /**
     * @var Connection
     */
    private $connection;

    public function getSubscribedEvents()
    {
        return [
            Events::onFlush,
            Events::postFlush,
        ];
    }

    /**
     * Records all products whose stock may have changed
     *
     * @param OnFlushEventArgs $eventArgs
     */
    public function onFlush(OnFlushEventArgs $eventArgs): void
    {
        $this->connection = $eventArgs->getEntityManager()->getConnection();
        $this->connection->fetchAll('select "' . __METHOD__ . '"');

        $unitOfWork = $eventArgs->getEntityManager()->getUnitOfWork();
        foreach ($unitOfWork->getScheduledEntityInsertions() as $entity) {
            $this->record($unitOfWork, $entity);
        }

        foreach ($unitOfWork->getScheduledEntityUpdates() as $entity) {
            $this->record($unitOfWork, $entity);
        }

        foreach ($unitOfWork->getScheduledEntityDeletions() as $entity) {
            $this->record($unitOfWork, $entity);
        }

        // Force to keep the transaction open until we update the stock movements
        if ($this->products) {
            $eventArgs->getEntityManager()->beginTransaction();
        }
    }

    /**
     * When everything is finished, we rewrite the stockMovement history for each products
     *
     * @param PostFlushEventArgs $eventArgs
     */
    public function postFlush(PostFlushEventArgs $eventArgs): void
    {
        $this->connection->fetchAll('select "' . __METHOD__ . '"');

        if (!$this->products) {
            return;
        }

        foreach ($this->products as $product) {
            $this->updateProduct($product);
        }
        $this->products = [];

        $entityManager = $eventArgs->getEntityManager();
        $entityManager->commit();
        $this->refreshUpdatedEntities($entityManager);
    }

    /**
     * Record all product that might need to update their stock
     *
     * @param UnitOfWork $unitOfWork
     * @param AbstractModel $entity
     */
    private function record(UnitOfWork $unitOfWork, AbstractModel $entity): void
    {
        if (!$entity instanceof StockMovement) {
            return;
        }

        $changes = $unitOfWork->getEntityChangeSet($entity);
        if (array_key_exists('product', $changes)) {
            $this->queueProduct($changes['product'][0]);
            $this->queueProduct($changes['product'][1]);
        }

        $this->queueProduct($entity->getProduct());
    }

    private function queueProduct(?Product $product): void
    {
        if ($product && !in_array($product, $this->products, true)) {
            $this->products[] = $product;
        }
    }

    private function updateProduct(Product $product): void
    {
        $this->connection->executeUpdate('SET @sum = 0; UPDATE stock_movement SET quantity = (@sum := @sum + delta) WHERE product_id = :product ORDER BY creation_date ASC, id ASC',
            [
                'product' => $product->getId(),
            ]);

        $this->connection->executeUpdate('UPDATE product SET quantity = @sum, purchase_status = IF(purchase_status = \'ok\' && @sum < minimum_quantity, \'to_order\', IF(@sum >= minimum_quantity, \'ok\', purchase_status)) WHERE id = :product',
            [
                'product' => $product->getId(),
            ]);
    }

    /**
     * Reload all objects that exist in memory and that could have be modified by our raw SQL
     *
     * @param EntityManager $entityManager
     */
    private function refreshUpdatedEntities(EntityManager $entityManager): void
    {
        $map = $entityManager->getUnitOfWork()->getIdentityMap();
        foreach ([StockMovement::class, Product::class] as $class) {
            foreach ($map[$class] ?? [] as $entity) {
                $entityManager->refresh($entity);
            }
        }
    }
}
