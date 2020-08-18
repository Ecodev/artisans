<?php

declare(strict_types=1);

namespace Application\Repository;

class LogRepository extends AbstractRepository implements \Ecodev\Felix\Repository\LogRepository
{
    /**
     * Log message to be used when the datatrans webhook starts
     */
    const DATATRANS_WEBHOOK_BEGIN = 'datatrans webhook begin';
    /**
     * Log message to be used when the datatrans webhook finishes
     */
    const DATATRANS_WEBHOOK_END = 'datatrans webhook end';

    use \Ecodev\Felix\Repository\Traits\LogRepository;
}
