<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Log;
use Application\Repository\LogRepository;

/**
 * @group Repository
 */
class LogRepositoryTest extends AbstractRepositoryTest
{
    /**
     * @var LogRepository
     */
    private $repository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Log::class);
    }

    public function testLoginFailedOften(): void
    {
        $this->getEntityManager()->getConnection()->exec('DELETE FROM log');
        _log()->info(LogRepository::LOGIN_FAILED);

        $result = $this->repository->loginFailedOften();
        self::assertFalse($result);

        _log()->info(LogRepository::LOGIN_FAILED);
        _log()->info(LogRepository::LOGIN_FAILED);
        _log()->info(LogRepository::LOGIN_FAILED);
        _log()->info(LogRepository::LOGIN_FAILED);
        _log()->info(LogRepository::LOGIN_FAILED);
        _log()->info(LogRepository::LOGIN_FAILED);

        $result = $this->repository->loginFailedOften();
        self::assertTrue($result, 'is your PHP date.timezone setting correct ?');
    }

    public function testDeleteOldLogs(): void
    {
        $result = $this->repository->deleteOldLogs();
        self::assertSame(0, $result);
    }
}
