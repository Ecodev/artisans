<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Account;
use Application\Model\TransactionLine;
use Application\Model\User;

class TransactionLineRepository extends AbstractRepository implements LimitedAccessSubQueryInterface
{
    /**
     * Returns pure SQL to get ID of all objects that are accessible to given user.
     *
     * @param null|User $user
     *
     * @return string
     */
    public function getAccessibleSubQuery(?User $user): string
    {
        if (!$user) {
            return '-1';
        }

        if (in_array($user->getRole(), [User::ROLE_RESPONSIBLE, User::ROLE_ADMINISTRATOR], true)) {
            return $this->getAllIdsQuery();
        }

        return 'SELECT transaction_line.id FROM transaction_line
              JOIN account ON transaction_line.debit_id = account.id OR transaction_line.credit_id = account.id 
              WHERE account.owner_id = ' . $user->getId();
    }

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
