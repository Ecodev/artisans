<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Model\Transaction;
use Application\Model\TransactionLine;
use Application\Model\User;
use Cake\Chronos\Date;
use Doctrine\ORM\EntityManager;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response\HtmlResponse;
use Zend\Expressive\Template\TemplateRendererInterface;

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
        $status = $body['status'] ?? '';

        switch ($status) {
            case 'success':
                $this->createTransactions($body);
                $message = [
                    'type' => $status,
                    'message' => $body['responseMessage'],
                    'detail' => $body,
                ];

                break;
            case 'error':
                $message = [
                    'type' => $status,
                    'message' => $body['errorMessage'],
                    'detail' => $body,
                ];

                break;
            case 'cancel':
                $message = [
                    'type' => 'error', // Here we cheat because the JS cannot handle 'cancel' status
                    'message' => 'Cancelled',
                    'detail' => $body,
                ];

                break;
            default:
                throw new \Exception('Unsupported status in Datatrans data: ' . $status);
        }

        $viewModel = [
            'message' => $message,
        ];

        return new HtmlResponse($this->template->render('app::datatrans', $viewModel));
    }

    private function createTransactions(array $body): void
    {
        $userId = $body['refno'];

        /** @var User $user */
        $user = $this->entityManager->getRepository(User::class)->getOneById((int) $userId);
        if (!$user) {
            throw new \Exception('Cannot create transactions without a user');
        }

        $account = $user->getAccount();
        if (!$account) {
            throw new \Exception('Cannot create transactions for a user who does not have an account');
        }

        if (!array_key_exists('amount', $body)) {
            // Do not support "registrations"
            throw new \Exception('Cannot create transactions without an amount');
        }

        $currency = $body['currency'] ?? '';
        if ($currency !== 'CHF') {
            throw new \Exception('Can only create transactions for CHF, but got: ' . $currency);
        }

        $now = Date::today();
        $datatransRef = $body['uppTransactionId'];
        $name = 'Datatrans: ' . $datatransRef;

        $transaction = new Transaction();
        $this->entityManager->persist($transaction);
        $transaction->setName($name);
        $transaction->setTransactionDate($now);

        $line = new TransactionLine();
        $this->entityManager->persist($line);
        $line->setName($name);
        $line->setTransactionDate($now);
        $line->setBalance((string) ($body['amount'] / 100));
        $line->setDatatransRef($datatransRef);
        $line->setTransaction($transaction);
        $line->setCredit($account);

        // This could be removed later on. For now it's mostly for debugging
        $line->setRemarks(json_encode($body, JSON_PRETTY_PRINT));

        $this->entityManager->flush();
    }
}
