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
     * @param string $email
     * @param string $password
     *
     * @return null|User
     */
    public function getOneByEmailPassword(string $email, string $password): ?User
    {
        /** @var null|User $user */
        $user = $this->getOneByEmail($email);

        if (!$user) {
            return null;
        }

        $hashFromDb = $user->getPassword();
        $isMd5 = mb_strlen($hashFromDb) === 32 && ctype_xdigit($hashFromDb);

        $possibleMd5 = [
            md5($password), // normal md5 for our test data
            md5('oQqnnn8sVBZzveU2zWCqdcu8N9JVE3GXFq6kS0i1ZyS3FkFoPZAN3GCA' . $password), // From PrestaShop `\ToolsCore::encrypt()` with hardcoded _COOKIE_KEY_ value
        ];

        // If we found a user and he has a correct MD5 or correct new hash, then return the user
        if (($isMd5 && in_array($hashFromDb, $possibleMd5, true)) || password_verify($password, $hashFromDb)) {

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
     * Unsecured way to get a user from its email.
     *
     * This should only be used in tests or controlled environment.
     *
     * @param null|string $email
     *
     * @return null|User
     */
    public function getOneByEmail(?string $email): ?User
    {
        $user = $this->getAclFilter()->runWithoutAcl(function () use ($email) {
            return $this->findOneByEmail($email);
        });

        return $user;
    }

    /**
     * Get or create the user for the given email
     *
     * @param string $email
     *
     * @return User
     */
    public function getOrCreate(string $email): User
    {
        $user = $this->getOneByEmail($email);
        if (!$user) {
            $user = new User();
            $this->getEntityManager()->persist($user);
            $user->setEmail($email);
        }

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
            ->andWhere('user.role = :role')
            ->andWhere("user.email IS NOT NULL AND user.email != ''")
            ->setParameter('role', User::ROLE_ADMINISTRATOR);

        $result = $this->getAclFilter()->runWithoutAcl(function () use ($qb) {
            return $qb->getQuery()->getResult();
        });

        return $result;
    }

    /**
     * Return the next available User code
     *
     * @return int
     */
    public function getNextCodeAvailable(): int
    {
        $qb = _em()->getConnection()->createQueryBuilder()
            ->select('IFNULL(MAX(u.code) + 1, 1)')
            ->from('user', 'u');

        return (int) $qb->execute()->fetchColumn();
    }
}
