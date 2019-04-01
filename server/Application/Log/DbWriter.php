<?php

declare(strict_types=1);

namespace Application\Log;

use Application\Model\User;
use Application\Repository\LogRepository;
use Zend\Log\Writer\AbstractWriter;

class DbWriter extends AbstractWriter
{
    /**
     * @var LogRepository
     */
    private $logRepository;

    /**
     * @var string
     */
    private $baseUrl;

    public function __construct(LogRepository $logRepository, string $baseUrl, $options = null)
    {
        parent::__construct($options);
        $this->logRepository = $logRepository;
        $this->baseUrl = $baseUrl;
    }

    /**
     * Write a message to the log
     *
     * @param array $event log data event
     */
    protected function doWrite(array $event): void
    {
        $completedEvent = $this->completeEvent($event);
        $this->logRepository->log($completedEvent);
    }

    private function completeEvent(array $event): array
    {
        $envData = $this->getEnvData();
        $event = array_merge($event, $envData);

        // If we are logging PHP errors, then we include all known information in message
        if ($event['extra']['errno'] ?? false) {
            $event['message'] .= "\nStacktrace:\n" . $this->getStacktrace();
        }

        $event['creation_date'] = $event['timestamp'];
        unset($event['timestamp'], $event['priorityName']);

        return $event;
    }

    /**
     * Retrieve dynamic information from environment to be logged.
     *
     * @return array
     */
    private function getEnvData(): array
    {
        $user = User::getCurrent();

        if (PHP_SAPI === 'cli') {
            global $argv;
            $request = $argv;
            $ip = 'script';
            $url = implode(' ', $argv);
            $referer = '';
        } else {
            $request = $_REQUEST;
            $ip = $_SERVER['REMOTE_ADDR'] ?? '';
            $url = $this->baseUrl . $_SERVER['REQUEST_URI'];
            $referer = $_SERVER['HTTP_REFERER'] ?? '';
        }

        $envData = [
            'creator_id' => $user ? $user->getId() : null,
            'url' => $url,
            'referer' => $referer,
            'request' => json_encode($request, JSON_PRETTY_PRINT),
            'ip' => $ip,
        ];

        return $envData;
    }

    /**
     * Returns the backtrace excluding the most recent calls to this function so we only get the interesting parts
     *
     * @return string
     */
    private function getStacktrace(): string
    {
        ob_start();
        @debug_print_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
        $trace = ob_get_contents();
        ob_end_clean();

        // Remove first items from backtrace as it's this function and previous logging functions which is not interesting
        $trace = preg_replace('/^#[0-4]\s+[^\n]*\n/m', '', $trace);

        // Renumber backtrace items.
        $trace = preg_replace_callback('/^#(\d+)/m', function ($matches) {
            return '#' . ($matches[1] - 5);
        }, $trace);

        return $trace;
    }
}
