<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Model\User;
use Application\Repository\UserRepository;
use Cake\Chronos\Chronos;
use Doctrine\ORM\EntityManager;
use Laminas\Diactoros\Response\HtmlResponse;
use Mezzio\Template\TemplateRendererInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class DatatransAction extends AbstractAction
{
    /** @var TemplateRendererInterface */
    private $template;

    /**
     * @var EntityManager
     */
    private $entityManager;

    public function __construct(EntityManager $entityManager, TemplateRendererInterface $template)
    {
        $this->entityManager = $entityManager;
        $this->template = $template;
    }

    /**
     * Webhook called by datatrans when a payment was made
     *
     * See documentation: https://api-reference.datatrans.ch/#failed-unsuccessful-authorization-response
     *
     * @param ServerRequestInterface $request
     * @param RequestHandlerInterface $handler
     *
     * @return ResponseInterface
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $request->getMethod();
        $body = $request->getParsedBody();

        try {
            if (!is_array($body)) {
                throw new \Exception('Parsed body is expected to be an array but got: ' . gettype($body));
            }

            $status = $body['status'] ?? '';

            $message = $this->dispatch($status, $body);
        } catch (\Throwable $exception) {
            $message = $this->createMessage('error', $exception->getMessage(), is_array($body) ? $body : []);
        }

        $viewModel = [
            'message' => $message,
        ];

        return new HtmlResponse($this->template->render('app::datatrans', $viewModel));
    }

    /**
     * Create a message in a coherent way
     *
     * @param string $status
     * @param string $message
     * @param array $detail
     *
     * @return array
     */
    private function createMessage(string $status, string $message, array $detail): array
    {
        return [
            'status' => $status,
            'message' => $message,
            'detail' => $detail,
        ];
    }

    /**
     * Dispatch the data received from Datatrans to take appropriate actions
     *
     * @param string $status
     * @param array $body
     *
     * @return array
     */
    private function dispatch(string $status, array $body): array
    {
        switch ($status) {
            case 'success':
                $this->createTransactions($body);
                $message = $this->createMessage($status, $body['responseMessage'], $body);

                break;
            case 'error':
                $message = $this->createMessage($status, $body['errorMessage'], $body);

                break;
            case 'cancel':
                $message = $this->createMessage($status, 'Cancelled', $body);

                break;
            default:
                throw new \Exception('Unsupported status in Datatrans data: ' . $status);
        }

        return $message;
    }

    private function createTransactions(array $body): void
    {
        $userId = $body['refno'] ?? null;

        /** @var UserRepository $userRepository */
        $userRepository = $this->entityManager->getRepository(User::class);
        $user = $userRepository->getOneById((int) $userId);
        if (!$user) {
            throw new \Exception('Cannot create transactions without a user');
        }

        if (!array_key_exists('amount', $body)) {
            // Do not support "registrations"
            throw new \Exception('Cannot create transactions without an amount');
        }

        $currency = $body['currency'] ?? '';
        if ($currency !== 'CHF') {
            throw new \Exception('Can only create transactions for CHF, but got: ' . $currency);
        }

        $now = Chronos::now();
        $datatransRef = $body['uppTransactionId'];
        $name = 'Versement en ligne';

        // TODO: something useful here...
    }
}
