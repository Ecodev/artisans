<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\User;
use Cake\Chronos\Chronos;

class UserRepository extends AbstractRepository implements LimitedAccessSubQueryInterface
{
    /**
     * Returns the user authenticated by its email and password
     *
     * @param string $login
     * @param string $password
     *
     * @return null|User
     */
    public function getByLoginPassword(string $login, string $password): ?User
    {
        /** @var User $user */
        $user = $this->getByLogin($login);

        if (!$user) {
            return null;
        }

        // Check user status
        if (!in_array($user->getStatus(), [User::STATUS_ACTIVE, User::STATUS_INACTIVE], true)) {
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
            $user->setLastLogin(new Chronos());
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
        $this->getAclFilter()->setEnabled(false);
        $user = $this->findOneById($id);
        $this->getAclFilter()->setEnabled(true);

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
    public function getByLogin(?string $login): ?User
    {
        $this->getAclFilter()->setEnabled(false);
        $user = $this->findOneByLogin($login);
        $this->getAclFilter()->setEnabled(true);

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

        $this->getAclFilter()->setEnabled(false);
        $result = $qb->getQuery()->getResult();
        $this->getAclFilter()->setEnabled(true);

        return $result;
    }

    /**
     * Returns pure SQL to get ID of all objects that are accessible to given user.
     *
     * @param null|User $user
     *
     * @return string
     */
    public function getAccessibleSubQuery(?User $user): string
    {
        if ($user) {
            return $this->getAllIdsQuery();
        }

        return '-1';
    }
}
