<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\DBAL\Types\ProductTypeType;
use Application\Model\Organization;
use Application\Repository\OrganizationRepository;

class OrganizationRepositoryTest extends AbstractRepositoryTest
{
    private OrganizationRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Organization::class);
    }

    /**
     * @dataProvider providerApplyOrganizationAccesses
     */
    public function testApplyOrganizationAccesses(array $users): void
    {
        // Insert all test users
        $connection = $this->getEntityManager()->getConnection();
        foreach ($users as $email => $data) {
            $user = $data[0];
            $user['email'] = $email;
            $connection->insert('user', $user);
        }

        $this->repository->applyOrganizationAccesses();

        // Assert each user
        foreach ($users as $email => $data) {
            $sql = 'SELECT subscription_last_review_id, subscription_type FROM user WHERE user.email = :email';
            $actual = $connection->fetchAssociative($sql, ['email' => $email]);

            self::assertEquals($data[1], $actual);
        }
    }

    public function providerApplyOrganizationAccesses(): iterable
    {
        yield 'no matching org, no subscription' => [
            [
                'foo@example.com' => [
                    ['subscription_last_review_id' => null, 'subscription_type' => null],
                    ['subscription_last_review_id' => null, 'subscription_type' => null],
                ],
            ],
        ];
        yield 'no matching org, with subscription' => [
            [
                'foo@example.com' => [
                    ['subscription_last_review_id' => 3001, 'subscription_type' => ProductTypeType::DIGITAL],
                    ['subscription_last_review_id' => 3001, 'subscription_type' => ProductTypeType::DIGITAL],
                ],
            ],
        ];
        yield 'matching org, no subscription' => [
            [
                'foo@university.com' => [
                    ['subscription_last_review_id' => null, 'subscription_type' => null],
                    ['subscription_last_review_id' => 3000, 'subscription_type' => ProductTypeType::DIGITAL],
                ],
            ],
        ];
        yield 'matching org, with subscription should upgrade type' => [
            [
                'foo@students.university.com' => [
                    ['subscription_last_review_id' => 3000, 'subscription_type' => ProductTypeType::PAPER],
                    ['subscription_last_review_id' => 3000, 'subscription_type' => ProductTypeType::BOTH],
                ],
            ],
        ];
        yield 'matching better org, with subscription should upgrade everything' => [
            [
                'foo@teachers.university.com' => [
                    ['subscription_last_review_id' => 3000, 'subscription_type' => ProductTypeType::PAPER],
                    ['subscription_last_review_id' => 3001, 'subscription_type' => ProductTypeType::BOTH],
                ],
            ],
        ];
        yield 'matching worse org, with subscription should not downgrade' => [
            [
                'foo@university.com' => [
                    ['subscription_last_review_id' => 3001, 'subscription_type' => ProductTypeType::DIGITAL],
                    ['subscription_last_review_id' => 3001, 'subscription_type' => ProductTypeType::DIGITAL],
                ],
            ],
        ];
    }
}
