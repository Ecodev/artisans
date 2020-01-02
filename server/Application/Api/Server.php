<?php

declare(strict_types=1);

namespace Application\Api;

use Doctrine\DBAL\Exception\DriverException;
use GraphQL\Error\Debug;
use GraphQL\Executor\ExecutionResult;
use GraphQL\GraphQL;
use GraphQL\Server\ServerConfig;
use GraphQL\Server\StandardServer;
use Mezzio\Session\SessionMiddleware;
use Psr\Http\Message\ServerRequestInterface;
use Throwable;

/**
 * A thin wrapper to serve GraphQL via HTTP or CLI
 */
class Server
{
    private $server;

    /**
     * @var ServerConfig
     */
    private $config;

    public function __construct(bool $debug)
    {
        GraphQL::setDefaultFieldResolver(new DefaultFieldResolver());
        $this->config = ServerConfig::create([
            'schema' => new Schema(),
            'queryBatching' => true,
            'debug' => $debug ? Debug::INCLUDE_DEBUG_MESSAGE | Debug::INCLUDE_TRACE : false,
            'errorsHandler' => function (array $errors, callable $formatter) {
                $result = [];
                foreach ($errors as $e) {
                    $result[] = $this->handleError($e, $formatter);
                }

                return $result;
            },
        ]);
        $this->server = new StandardServer($this->config);
    }

    /**
     * @param ServerRequestInterface $request
     *
     * @return ExecutionResult|ExecutionResult[]
     */
    public function execute(ServerRequestInterface $request)
    {
        if (!$request->getParsedBody()) {
            $request = $request->withParsedBody(json_decode($request->getBody()->getContents(), true));
        }

        // Affect it to global request so it is available for log purpose in case of error
        $_REQUEST = $request->getParsedBody();

        // Set current session as the only context we will ever need
        $session = $request->getAttribute(SessionMiddleware::SESSION_ATTRIBUTE);
        $this->config->setContext($session);

        return $this->server->executePsrRequest($request);
    }

    /**
     * Send response to CLI
     *
     * @param ExecutionResult $result
     */
    public function sendCli(ExecutionResult $result): void
    {
        echo json_encode($result, JSON_PRETTY_PRINT) . PHP_EOL;
    }

    /**
     * Custom error handler to log in DB and show trigger messages to end-user
     *
     * @param Throwable $exception
     * @param callable $formatter
     *
     * @return array
     */
    private function handleError(Throwable $exception, callable $formatter): array
    {
        // Always log exception in DB (and by email)
        _log()->err($exception);

        // If we are absolutely certain that the error comes from one of our trigger with a custom message for end-user,
        // then wrap the exception to make it showable to the end-user
        $previous = $exception->getPrevious();
        if ($previous instanceof DriverException && $previous->getSQLState() === '45000' && $previous->getPrevious() && $previous->getPrevious()->getPrevious()) {
            $message = $previous->getPrevious()->getPrevious()->getMessage();
            $userMessage = preg_replace('~SQLSTATE\[45000\]: <<Unknown error>>: \d+ ~', '', $message, -1, $count);
            if ($count === 1) {
                $exception = new Exception($userMessage, null, $exception);
            }
        }

        return $formatter($exception);
    }
}
