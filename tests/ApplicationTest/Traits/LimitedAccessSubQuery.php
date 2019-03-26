<?php

declare(strict_types=1);

namespace ApplicationTest\Traits;

use Application\Model\User;

/**
 * Trait to test limited access sub queries
 */
trait LimitedAccessSubQuery
{
    /**
     * @dataProvider providerGetAccessibleSubQuery
     *
     * @param null|string $login
     * @param array $expected
     */
    public function testGetAccessibleSubQuery(?string $login, array $expected): void
    {
        $user = _em()->getRepository(User::class)->getByLogin($login);
        $subQuery = $this->repository->getAccessibleSubQuery($user);
        if ($subQuery === '-1') {
            $ids = [];
        } else {
            $ids = _em()->getConnection()->executeQuery($subQuery)->fetchAll(\PDO::FETCH_COLUMN);
        }

        sort($ids);

        self::assertEquals($expected, $ids);
    }
}
