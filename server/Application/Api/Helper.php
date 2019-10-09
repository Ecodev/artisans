<?php

declare(strict_types=1);

namespace Application\Api;

use Application\Acl\Acl;
use Application\Model\AbstractModel;
use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\Product;
use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Tools\Pagination\Paginator;
use GraphQL\Doctrine\Definition\EntityID;

abstract class Helper
{
    public static function throwIfDenied(AbstractModel $model, string $privilege): void
    {
        $acl = new Acl();
        if (!$acl->isCurrentUserAllowed($model, $privilege)) {
            throw new Exception($acl->getLastDenialMessage());
        }
    }

    public static function paginate(array $pagination, QueryBuilder $query): array
    {
        $offset = $pagination['offset'] ?? 0;
        $pageIndex = $pagination['pageIndex'] ?? 0;
        $pageSize = $pagination['pageSize'];

        $paginator = new Paginator($query);
        $paginator
            ->getQuery()
            ->setFirstResult($offset ? $offset : $pageSize * $pageIndex)
            ->setMaxResults($pageSize);

        $pagination['length'] = $paginator->count();
        $pagination['items'] = $paginator->getIterator();

        return $pagination;
    }

    public static function hydrate(AbstractModel $object, array $input): void
    {
        foreach ($input as $name => $value) {
            if ($value instanceof EntityID) {
                $value = $value->getEntity();
            }

            $setter = 'set' . ucfirst($name);
            $object->$setter($value);
        }
    }

    /**
     * Returns aggregated fields (as scalar) for the given QueryBuilder
     *
     * @param string $class
     * @param QueryBuilder $qb
     *
     * @return array
     */
    public static function aggregatedFields(string $class, QueryBuilder $qb): array
    {
        $result = [];

        if ($class === Product::class) {
            $qb->resetDQLPart('select')
                ->resetDQLPart('orderBy')
                ->addSelect('SUM(product1.pricePerUnitCHF) AS totalPricePerUnitCHF')
                ->addSelect('SUM(product1.pricePerUnitEUR) AS totalPricePerUnitEUR');

            $result = $qb->getQuery()->getResult()[0];
        } elseif ($class === OrderLine::class) {
            $qb->resetDQLPart('select')
                ->resetDQLPart('orderBy')
                ->addSelect('SUM(orderLine1.balanceCHF) AS totalBalanceCHF')
                ->addSelect('SUM(orderLine1.balanceEUR  ) AS totalBalanceEUR')
                ->addSelect('SUM(orderLine1.quantity) AS totalQuantity');

            $result = $qb->getQuery()->getResult()[0];
        } elseif ($class === Order::class) {
            $qb->resetDQLPart('select')
                ->resetDQLPart('orderBy')
                ->addSelect('SUM(order1.balanceCHF) AS totalBalanceCHF')
                ->addSelect('SUM(order1.balanceEUR) AS totalBalanceEUR');

            $result = $qb->getQuery()->getResult()[0];
        }

        return $result;
    }
}
