<?php

declare(strict_types=1);

namespace ApplicationTest\Traits;

use Application\Model\User;
use Application\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use PDO;

/**
 * Trait to test limited access sub queries
 */
trait LimitedAccessSubQuery
{
    abstract public function getEntityManager(): EntityManager;

    /**
     * @dataProvider providerGetAccessibleSubQuery
     */
    public function testGetAccessibleSubQuery(?string $login, array $expected): void
    {
        /** @var UserRepository $userRepository */
        $userRepository = $this->getEntityManager()->getRepository(User::class);
        $user = $userRepository->getOneByEmail($login . '@example.com');
        $subQuery = $this->repository->getAccessibleSubQuery($user);
        if ($subQuery === '-1') {
            $ids = [];
        } else {
            $ids = $this->getEntityManager()->getConnection()->executeQuery($subQuery)->fetchAll(PDO::FETCH_COLUMN);
        }

        sort($ids);

        self::assertEquals($expected, $ids);
    }
}
