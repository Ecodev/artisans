<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Organization;
use Application\Repository\OrganizationRepository;

class OrganizationRepositoryTest extends AbstractRepositoryTest
{
    /**
     * @var OrganizationRepository
     */
    private $repository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Organization::class);
    }

    public function testGetBestMatchingOrganization(): void
    {
        self::assertNull($this->repository->getBestMatchingOrganization('foo@example.com'));
        self::assertSame(50000, $this->repository->getBestMatchingOrganization('foo@university.com')->getId());
        self::assertSame(50000, $this->repository->getBestMatchingOrganization('foo@students.university.com')->getId());
        self::assertSame(50001, $this->repository->getBestMatchingOrganization('foo@teachers.university.com')->getId());
    }
}
