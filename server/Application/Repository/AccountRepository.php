<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\DBAL\Types\AccountTypeType;
use Application\Model\Account;
use Application\Model\User;

class AccountRepository extends AbstractRepository implements LimitedAccessSubQueryInterface
{
    private const PARENT_ACCOUNT_ID_FOR_USER = 10011;

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

        return $this->getAllIdsForOwnerQuery($user);
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
        $account = $this->findOneByOwner($user);
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
}
