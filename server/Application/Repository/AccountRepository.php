<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\DBAL\Types\AccountTypeType;
use Application\Model\Account;
use Application\Model\User;

class AccountRepository extends AbstractRepository
{
    private const PARENT_ACCOUNT_ID_FOR_USER = 10011;

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

            $parent = $this->findOneById(self::PARENT_ACCOUNT_ID_FOR_USER);
            if (!$parent) {
                throw new \Exception('Cannot find parent account for creation of user account');
            }
            $account->setParent($parent);
        }

        return $account;
    }
}
