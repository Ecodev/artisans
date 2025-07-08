<?php

declare(strict_types=1);

namespace Application\Handler;

use Application\Enum\OrderStatus;
use Application\Enum\PaymentMethod;
use Application\Model\Order;
use Application\Model\User;
use Application\Repository\LogRepository;
use Application\Repository\OrderRepository;
use Application\Repository\UserRepository;
use Application\Service\MessageQueuer;
use Doctrine\ORM\EntityManager;
use Ecodev\Felix\Format;
use Ecodev\Felix\Handler\AbstractHandler;
use Ecodev\Felix\Service\Mailer;
use Exception;
use Laminas\Diactoros\Response\HtmlResponse;
use Mezzio\Template\TemplateRendererInterface;
use Money\Money;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Throwable;

class DatatransHandler extends AbstractHandler
{
    public function __construct(
        private readonly EntityManager $entityManager,
        private readonly TemplateRendererInterface $template,
        private readonly array $config,
        private readonly Mailer $mailer,
        private readonly MessageQueuer $messageQueuer,
    ) {}

    /**
     * Webhook called by datatrans when a payment was made.
     *
     * See documentation: https://api-reference.datatrans.ch/#failed-unsuccessful-authorization-response
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $body = $request->getParsedBody();
        $extraToLog = is_array($body) ? $body : ['rawBody' => $request->getBody()->getContents()];

        _log()->info(LogRepository::DATATRANS_WEBHOOK_BEGIN, $extraToLog);

        try {
            if (!is_array($body)) {
                throw new Exception('Parsed body is expected to be an array but got: ' . gettype($body));
            }

            if (isset($this->config['key'])) {
                $this->checkSignature($body, $this->config['key']);
            }
            $status = $body['status'] ?? '';

            $message = $this->dispatch($status, $body);
        } catch (Throwable $exception) {
            $message = $this->createMessage('error', $exception->getMessage(), is_array($body) ? $body : []);
        }

        $viewModel = [
            'message' => $message,
        ];

        _log()->info(LogRepository::DATATRANS_WEBHOOK_END, $message);

        return new HtmlResponse($this->template->render('app::datatrans', $viewModel));
    }

    /**
     * Make sure the signature protecting important body fields is valid.
     *
     * @param string $key HMAC-SHA256 signing key in hexadecimal format
     */
    private function checkSignature(array $body, string $key): void
    {
        if (!isset($body['sign'])) {
            throw new Exception('Missing HMAC signature');
        }

        $aliasCC = $body['aliasCC'] ?? '';
        $valueToSign = $aliasCC . @$body['merchantId'] . @$body['amount'] . @$body['currency'] . @$body['refno'];
        $expectedSign = hash_hmac('sha256', trim($valueToSign), hex2bin(trim($key)));
        if ($expectedSign !== $body['sign']) {
            throw new Exception('Invalid HMAC signature');
        }
    }

    /**
     * Create a message in a coherent way.
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
     * Dispatch the data received from Datatrans to take appropriate actions.
     */
    private function dispatch(string $status, array $body): array
    {
        switch ($status) {
            case 'success':
                $this->validateOrder($body);
                $message = $this->createMessage($status, $body['responseMessage'], $body);

                break;
            case 'error':
                $message = $this->createMessage($status, $body['errorMessage'], $body);

                break;
            case 'cancel':
                $message = $this->createMessage($status, 'Cancelled', $body);

                break;
            default:
                throw new Exception('Unsupported status in Datatrans data: ' . $status);
        }

        return $message;
    }

    private function validateOrder(array $body): void
    {
        $orderId = $body['refno'] ?? null;

        /** @var OrderRepository $orderRepository */
        $orderRepository = $this->entityManager->getRepository(Order::class);

        /** @var null|Order $order */
        $order = $orderRepository->getAclFilter()->runWithoutAcl(fn () => $orderRepository->findOneById($orderId));

        if (!$order) {
            throw new Exception('Cannot validate an order without a valid order ID');
        }

        if ($order->getPaymentMethod() !== PaymentMethod::Datatrans) {
            throw new Exception('Cannot validate an order whose payment method is: ' . $order->getPaymentMethod()->value);
        }

        if ($order->getStatus() === OrderStatus::Validated) {
            throw new Exception('Cannot validate an order which is already validated');
        }

        $money = $this->getMoney($body);

        if (!$order->getBalanceCHF()->equals($money) && !$order->getBalanceEUR()->equals($money)) {
            $expectedCHF = $this->formatMoney($order->getBalanceCHF());
            $expectedEUR = $this->formatMoney($order->getBalanceEUR());
            $actual = $this->formatMoney($money);

            throw new Exception("Cannot validate an order with incorrect balance. Expected $expectedCHF, or $expectedEUR, but got: " . $actual);
        }

        // Actually validate
        $orderRepository->getAclFilter()->runWithoutAcl(function () use ($order, $body): void {
            $order->setStatus(OrderStatus::Validated);
            $order->setInternalRemarks(json_encode($body, JSON_PRETTY_PRINT));
        });

        $this->entityManager->flush();

        $this->notify($order);
    }

    private function formatMoney(Money $money): string
    {
        return Format::money($money) . ' ' . $money->getCurrency()->getCode();
    }

    private function getMoney(array $body): Money
    {
        if (!array_key_exists('amount', $body)) {
            // Do not support "registrations"
            throw new Exception('Cannot validate an order without an amount');
        }
        $amount = $body['amount'];

        $currency = $body['currency'] ?? '';
        if ($currency === 'CHF') {
            return Money::CHF($amount);
        }

        if ($currency === 'EUR') {
            return Money::EUR($amount);
        }

        throw new Exception('Can only accept payment in CHF or EUR, but got: ' . $currency);
    }

    /**
     * Notify the user and the admins.
     */
    private function notify(Order $order): void
    {
        /** @var UserRepository $repository */
        $repository = $this->entityManager->getRepository(User::class);

        $user = $order->getOwner();

        if ($user) {
            $message = $repository->getAclFilter()->runWithoutAcl(fn () => $this->messageQueuer->queueUserValidatedOrder($user, $order));
            $this->mailer->sendMessageAsync($message);
        }

        foreach ($this->messageQueuer->getAllEmailsToNotify() as $adminEmail) {
            $message = $this->messageQueuer->queueAdminValidatedOrder($adminEmail, $order);
            $this->mailer->sendMessageAsync($message);
        }
    }
}
