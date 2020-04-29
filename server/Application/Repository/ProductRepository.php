<?php

declare(strict_types=1);

namespace Application\Repository;

class ProductRepository extends AbstractRepository
{
    /**
     * Returns all formatted contents
     *
     * @return string[]
     */
    public function getFormattedContents(): array
    {
        $contents = $this->getEntityManager()->getConnection()->createQueryBuilder()
            ->from('product')
            ->addSelect('id')
            ->addSelect('description')
            ->addSelect('content')
            ->orderBy('id')->execute()->fetchAll();

        return $contents;
    }
}
