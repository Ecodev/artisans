<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Account;
use Application\Model\TransactionLine;

class TransactionLineRepository extends AbstractRepository
{
    /**
     * Get all transaction lines matching a given account in credit or debit
     *
     * @return TransactionLine[]
     */
    public function findByDebitOrCredit(Account $account): array
    {
        $qb = $this->createQueryBuilder('line')
            ->where('line.debit = :account')
            ->orWhere('line.credit = :account')
            ->setParameter('account', $account);

        $query = $qb->getQuery();

        $result = $query->getResult();

        return $result;
    }
}
