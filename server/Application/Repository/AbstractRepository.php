<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\AbstractModel;
use Doctrine\ORM\EntityRepository;

/**
 * Class AbstractRepository.
 *
 * @method null|AbstractModel findOneById(integer $id)
 */
abstract class AbstractRepository extends EntityRepository
{
    use \Ecodev\Felix\Repository\Traits\Repository;

    /**
     * Count the total number of objects.
     */
    public function getCount(): int
    {
        $connection = $this->getEntityManager()->getConnection();

        $query = $connection->createQueryBuilder()
            ->select('COUNT(*)')
            ->from($connection->quoteIdentifier($this->getClassMetadata()->getTableName()));

        return (int) $query->execute()->fetchOne();
    }
}
