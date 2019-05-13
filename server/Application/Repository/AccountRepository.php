<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\DBAL\Types\AccountTypeType;
use Application\Model\Account;
use Application\Model\User;
use Money\Money;

class AccountRepository extends AbstractRepository implements LimitedAccessSubQueryInterface
{
    private const PARENT_ACCOUNT_ID_FOR_USER = 10038;
    const ACCOUNT_ID_FOR_SALE = 10013;
    const ACCOUNT_ID_FOR_BANK = 10030;

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

        return $this->getAllIdsForFamilyQuery($user);
    }

    /**
     * Unsecured way to get a account from its ID.
     *
     * This should only be used in tests or controlled environment.
     *
     * @param int $id
     *
     * @return null|Account
     */
    private function getOneById(int $id): ?Account
    {
        $this->getAclFilter()->setEnabled(false);
        $account = $this->findOneById($id);
        $this->getAclFilter()->setEnabled(true);

        return $account;
    }

    /**
     * This will return, and potentially create, an account for the given user
     *
     * @param User $user
     *
     * @return Account
     */
    public function getOrCreate(User $user): Account
    {
        // If an account already exists, because getOrCreate was called once before without flushing in between,
        // then can return immediately
        if ($user->getAccount()) {
            return $user->getAccount();
        }

        // If user have an owner, then create account for the owner instead
        if ($user->getOwner()) {
            $user = $user->getOwner();
        }

        $this->getAclFilter()->setEnabled(false);
        $account = $this->findOneByOwner($user);
        $this->getAclFilter()->setEnabled(true);

        if (!$account) {
            $account = new Account();
            $this->getEntityManager()->persist($account);
            $account->setOwner($user);
            $account->setType(AccountTypeType::LIABILITY);
            $account->setName($user->getName());

            $maxCode = $this->getEntityManager()->getConnection()->fetchColumn('SELECT MAX(code) FROM account WHERE parent_id = ' . self::PARENT_ACCOUNT_ID_FOR_USER);
            $newCode = ++$maxCode;
            $account->setCode((string) $newCode);

            $parent = $this->getOneById(self::PARENT_ACCOUNT_ID_FOR_USER);
            if (!$parent) {
                throw new \Exception('Cannot find parent account for creation of user account');
            }
            $account->setParent($parent);
        }

        return $account;
    }

    /**
     * Sum balance by account type
     *
     * @API\Input(type="AccountType")
     *
     * @param string $accountType
     *
     * @return Money
     */
    public function totalBalanceByType(string $accountType): Money
    {
        $qb = $this->getEntityManager()->getConnection()->createQueryBuilder()
            ->select('SUM(balance)')
            ->from($this->getClassMetadata()->getTableName())
            ->where('type = :type');

        $qb->setParameter('type', $accountType);

        $result = $qb->execute();

        return Money::CHF($result->fetchColumn());
    }
}
