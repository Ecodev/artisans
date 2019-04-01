<?php

declare(strict_types=1);

namespace Application\Repository;

use Cake\Chronos\Chronos;
use Doctrine\DBAL\Connection;
use Zend\Log\Logger;

class LogRepository extends AbstractRepository
{
    /**
     * Log message to be used when user log in
     */
    const LOGIN = 'login';

    /**
     * Log message to be used when user cannot log in
     */
    const LOGIN_FAILED = 'login failed';

    /**
     * This should NOT be called directly, instead use `_log()` to log stuff
     *
     * @param array $event
     */
    public function log(array $event): void
    {
        $event['creation_date'] = Chronos::instance($event['creation_date'])->toIso8601String();
        $event['extra'] = json_encode($event['extra']);

        $this->getEntityManager()->getConnection()->insert('log', $event);
    }

    /**
     * Returns whether the current IP often failed to login
     *
     * @return bool
     */
    public function loginFailedOften(): bool
    {
        if (PHP_SAPI === 'cli') {
            $ip = 'script';
        } else {
            $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        }

        $select = $this->getEntityManager()->getConnection()->createQueryBuilder()
            ->select('message')
            ->from('log')
            ->andWhere('priority = :priority')
            ->setParameter('priority', Logger::INFO)
            ->andWhere('message IN (:message)')
            ->setParameter('message', [self::LOGIN_FAILED, self::LOGIN], Connection::PARAM_STR_ARRAY)
            ->andWhere('creation_date > DATE_SUB(NOW(), INTERVAL 30 MINUTE)')
            ->andWhere('ip = :ip')
            ->setParameter('ip', $ip)
            ->orderBy('id', 'DESC');

        $events = $select->execute()->fetchAll(\PDO::FETCH_COLUMN);

        // Goes from present to past and count failure, until the last time we succeeded logging in
        $failureCount = 0;
        foreach ($events as $event) {
            if ($event === self::LOGIN) {
                break;
            }
            ++$failureCount;
        }

        return $failureCount > 5;
    }

    /**
     * Delete log entries which are errors/warnings and older than one month
     * We always keep Logger::INFO level because we use it for statistics
     *
     * @return int the count deleted logs
     */
    public function deleteOldLogs(): int
    {
        $connection = $this->getEntityManager()->getConnection();
        $query = $connection->createQueryBuilder()
            ->delete('log')
            ->andWhere('log.priority != :priority OR message = :message')
            ->setParameter('priority', Logger::INFO)
            ->setParameter('message', self::LOGIN_FAILED)
            ->andWhere('log.creation_date < DATE_SUB(NOW(), INTERVAL 1 MONTH)');

        $connection->query('LOCK TABLES `log` WRITE;');
        $count = $query->execute();
        $connection->query('UNLOCK TABLES;');

        return $count;
    }
}
