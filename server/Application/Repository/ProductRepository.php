<?php

declare(strict_types=1);

namespace Application\Repository;

class ProductRepository extends AbstractRepository
{
    /**
     * Disable discountable prices for all products
     */
    public function disableAllDiscountablePrices(): void
    {
        $qb = $this->getEntityManager()->createQueryBuilder()
            ->update('\Application\Model\Product', 'p')
            ->set('p.ponderatePrice', '?1')
            ->where('p.ponderatePrice = ?2')
            ->setParameter(1, 0)
            ->setParameter(2, 1);

        $qb->getQuery()->execute();
    }
}
