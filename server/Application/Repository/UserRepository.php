<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\User;

class UserRepository extends AbstractRepository implements LimitedAccessSubQueryInterface
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

        return $this->getAllIdsQuery();
    }

    /**
     * Returns the user authenticated by its email and password
     *
     * @param string $login
     * @param string $password
     *
     * @return null|User
     */
    public function getOneByLoginPassword(string $login, string $password): ?User
    {
        /** @var User $user */
        $user = $this->getOneByLogin($login);

        if (!$user) {
            return null;
        }

        // Check user status
        if (!in_array($user->getStatus(), [User::STATUS_ACTIVE, User::STATUS_INACTIVE, User::STATUS_NEW], true)) {
            return null;
        }

        $hashFromDb = $user->getPassword();
        $isMd5 = mb_strlen($hashFromDb) === 32 && ctype_xdigit($hashFromDb);

        // If we found a user and he has a correct MD5 or correct new hash, then return the user
        if (($isMd5 && md5($password) === $hashFromDb) || password_verify($password, $hashFromDb)) {

            // Update the hash in DB, if we are still MD5, or if PHP default options changed
            if ($isMd5 || password_needs_rehash($hashFromDb, PASSWORD_DEFAULT)) {
                $user->setPassword($password);
            }
            $user->revokeToken();
            _em()->flush();

            return $user;
        }

        return null;
    }

    /**
     * Unsecured way to get a user from its ID.
     *
     * This should only be used in tests or controlled environment.
     *
     * @param int $id
     *
     * @return null|User
     */
    public function getOneById(int $id): ?User
    {
        $user = $this->getAclFilter()->runWithoutAcl(function () use ($id) {
            return $this->findOneById($id);
        });

        return $user;
    }

    /**
     * Unsecured way to get a user from its login.
     *
     * This should only be used in tests or controlled environment.
     *
     * @param null|string $login
     *
     * @return null|User
     */
    public function getOneByLogin(?string $login): ?User
    {
        $user = $this->getAclFilter()->runWithoutAcl(function () use ($login) {
            return $this->findOneByLogin($login);
        });

        return $user;
    }

    /**
     * Get all administrators to notify by email
     *
     * @return User[]
     */
    public function getAllAdministratorsToNotify(): array
    {
        $qb = $this->createQueryBuilder('user')
            ->andWhere('user.status = :status')
            ->andWhere('user.role = :role')
            ->andWhere("user.email IS NOT NULL AND user.email != ''")
            ->setParameter('status', User::STATUS_ACTIVE)
            ->setParameter('role', User::ROLE_ADMINISTRATOR);

        $result = $this->getAclFilter()->runWithoutAcl(function () use ($qb) {
            return $qb->getQuery()->getResult();
        });

        return $result;
    }

    public function getAllToQueueBalanceMessage(bool $onlyNegativeBalance = false): array
    {
        $qb = $this->createQueryBuilder('user')
            ->addSelect('account')
            ->join('user.accounts', 'account')
            ->andWhere('user.status != :status')
            ->andWhere("user.email IS NOT NULL AND user.email != ''")
            ->setParameter('status', User::STATUS_ARCHIVED)
            ->addOrderBy('user.id');

        if ($onlyNegativeBalance) {
            $qb->andWhere('account.balance < 0');
        }

        $result = $this->getAclFilter()->runWithoutAcl(function () use ($qb) {
            return $qb->getQuery()->getResult();
        });

        return $result;
    }

    /**
     * Return all users that are family owners (and should have Account)
     *
     * @return User[]
     */
    public function getAllFamilyOwners(): array
    {
        $qb = $this->createQueryBuilder('user')
            ->andWhere('user.owner IS NULL OR user.owner = user')
            ->addOrderBy('user.id');

        return $qb->getQuery()->getResult();
    }

    /**
     * Return all users that are not family owners but still have an Account
     *
     * @return User[]
     */
    public function getAllNonFamilyOwnersWithAccount(): array
    {
        $qb = $this->createQueryBuilder('user')
            ->join('user.accounts', 'account')
            ->andWhere('user.owner IS NOT NULL AND user.owner != user')
            ->addOrderBy('user.id');

        return $qb->getQuery()->getResult();
    }
}
