<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\User;
use Ecodev\Felix\Repository\LimitedAccessSubQuery;

/**
 * @extends AbstractRepository<User>
 */
class UserRepository extends AbstractRepository implements LimitedAccessSubQuery
{
    /**
     * Returns pure SQL to get ID of all objects that are accessible to given user.
     *
     * @param null|User $user
     */
    public function getAccessibleSubQuery(?\Ecodev\Felix\Model\User $user): string
    {
        if (!$user) {
            $facilitator = $this->getEntityManager()->getConnection()->quote(User::ROLE_FACILITATOR);

            return 'SELECT id FROM user WHERE role = ' . $facilitator;
        }

        return '';
    }

    /**
     * Returns the user authenticated by its email and password.
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
            $this->getEntityManager()->flush();

            return $user;
        }

        return null;
    }

    /**
     * Unsecured way to get a user from its ID.
     *
     * This should only be used in tests or controlled environment.
     */
    public function getOneById(int $id): ?User
    {
        $user = $this->getAclFilter()->runWithoutAcl(fn () => $this->findOneById($id));

        return $user;
    }

    /**
     * Unsecured way to get a user from its email.
     *
     * This should only be used in tests or controlled environment.
     */
    public function getOneByEmail(?string $email): ?User
    {
        $user = $this->getAclFilter()->runWithoutAcl(fn () => $this->findOneByEmail($email));

        return $user;
    }

    /**
     * Get or create the user for the given email.
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
}
