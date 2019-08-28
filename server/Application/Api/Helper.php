<?php

declare(strict_types=1);

namespace Application\Api;

use Application\Acl\Acl;
use Application\Model\AbstractModel;
use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\Product;
use Application\Model\StockMovement;
use Application\Model\TransactionLine;
use Application\Repository\ExportExcelInterface;
use Doctrine\ORM\Query;
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
                ->addSelect('SUM(product1.supplierPrice) AS totalSupplierPrice')
                ->addSelect('SUM(product1.pricePerUnit) AS totalPricePerUnit');

            $result = $qb->getQuery()->getResult()[0];
        } elseif ($class === TransactionLine::class) {
            $qb->resetDQLPart('select')
                ->resetDQLPart('orderBy')
                ->addSelect('SUM(transactionLine1.balance) AS totalBalance');

            $result = $qb->getQuery()->getResult()[0];
        } elseif ($class === OrderLine::class) {
            $qb->resetDQLPart('select')
                ->resetDQLPart('orderBy')
                ->addSelect('SUM(orderLine1.balance) AS totalBalance')
                ->addSelect('SUM(orderLine1.quantity) AS totalQuantity');

            $result = $qb->getQuery()->getResult()[0];
        } elseif ($class === StockMovement::class) {
            $qb->resetDQLPart('select')
                ->resetDQLPart('orderBy')
                ->addSelect('SUM(stockMovement1.delta) AS totalDelta')
                ->addSelect('SUM(IF(FIND_IN_SET(stockMovement1.type, \'sale,special_sale\') > 0, stockMovement1.delta, 0)) as totalSale')
                ->addSelect('SUM(IF(stockMovement1.type = \'loss\', stockMovement1.delta, 0)) as totalLoss')
                ->addSelect('SUM(IF(stockMovement1.type = \'delivery\', stockMovement1.delta, 0)) as totalDelivery')
                ->addSelect('SUM(IF(stockMovement1.type = \'inventory\', stockMovement1.delta, 0)) as totalInventory');

            $result = $qb->getQuery()->getResult()[0];
        } elseif ($class === Order::class) {
            $qb->resetDQLPart('select')
                ->resetDQLPart('orderBy')
                ->addSelect('SUM(order1.balance) AS totalBalance');

            $result = $qb->getQuery()->getResult()[0];
        }

        return $result;
    }

    /**
     * Lazy resolve the Excel export of the listing query
     *
     * @param string $class
     * @param QueryBuilder $qb
     *
     * @return array
     */
    public static function excelExportField(string $class, QueryBuilder $qb): array
    {
        $result = [];

        $repository = _em()->getRepository($class);

        if ($repository instanceof ExportExcelInterface) {
            $qb->join('transactionLine1.transaction', 'transaction1');
            $qb->leftJoin('transactionLine1.transactionTag', 'tag1');
            $qb->leftJoin('transactionLine1.debit', 'debitAccount');
            $qb->leftJoin('transactionLine1.credit', 'creditAccount');
            $qb->addSelect('transaction1');
            $qb->addSelect('tag1');
            $qb->addSelect('debitAccount');
            $qb->addSelect('creditAccount');
            $query = $qb->getQuery();
            $result['excelExport'] = function () use ($query, $repository): string {
                return $repository->exportExcel($query);
            };
        }

        return $result;
    }
}
