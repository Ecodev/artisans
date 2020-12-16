<?php

declare(strict_types=1);

namespace ApplicationTest\Handler;

use Application\DBAL\Types\MessageTypeType;
use Application\Handler\DatatransHandler;
use Application\Model\Message;
use Application\Model\Order;
use Application\Service\MessageQueuer;
use ApplicationTest\Traits\TestWithTransactionAndUser;
use Doctrine\ORM\EntityManager;
use Ecodev\Felix\Service\Mailer;
use Ecodev\Felix\Service\MessageRenderer;
use Laminas\Diactoros\ServerRequest;
use Mezzio\Template\TemplateRendererInterface;
use PHPUnit\Framework\TestCase;

class DatatransHandlerTest extends TestCase
{
    use TestWithTransactionAndUser;

    public function testNotifications(): void
    {
        // Valid request
        $request = new ServerRequest();
        $request = $request->withParsedBody([
            'uppTransactionId' => '123456789012345678',
            'status' => 'success',
            'refno' => '16001',
            'amount' => '1000',
            'currency' => 'CHF',
            'responseMessage' => 'Payment was successful',
        ]);

        // Mailer will not actually send the message, but it will still flush it in DB as usual
        $mailer = $this->createMock(Mailer::class);
        $mailer->expects(self::exactly(2))
            ->method('sendMessageAsync')
            ->willReturnCallback(function (): void {
                _em()->flush();
            });

        global $container;
        $renderer = $container->get(TemplateRendererInterface::class);

        $entityManager = $container->get(EntityManager::class);
        $messageRenderer = $container->get(MessageRenderer::class);
        $config = $container->get('config');

        $messageQueuer = new MessageQueuer(
            $entityManager,
            $messageRenderer,
            ['email' => ['admins' => ['administrator@example.com']]],
        );

        $handler = new DatatransHandler(_em(), $renderer, [], $mailer, $messageQueuer);

        // Before we have no notifications at all
        self::assertFalse($this->hasUserNotification());
        self::assertFalse($this->hasAdminNotification());

        $handler->handle($request);

        // After we have exactly 1 notification for user and 1 for admin
        self::assertTrue($this->hasUserNotification());
        self::assertTrue($this->hasAdminNotification());
    }

    private function hasUserNotification(): bool
    {
        return $this->hasMessage('othermember@example.com', MessageTypeType::USER_VALIDATED_ORDER);
    }

    private function hasAdminNotification(): bool
    {
        return $this->hasMessage('administrator@example.com', MessageTypeType::ADMIN_VALIDATED_ORDER);
    }

    private function hasMessage(string $email, string $type): bool
    {
        $sql = "SELECT COUNT(*) = 1 FROM message WHERE email = '$email' AND type = '$type'";
        $result = (bool) _em()->getConnection()->fetchOne($sql);

        return $result;
    }

    /**
     * @dataProvider providerProcess
     */
    public function testProcess(?array $data, array $expectedViewModel): void
    {
        // Message always include input data
        $expectedViewModel['message']['detail'] = $data ?? [];
        $renderer = $this->createMock(TemplateRendererInterface::class);
        $renderer->expects(self::once())->method('render')->with('app::datatrans', $expectedViewModel)->willReturn('');

        $request = new ServerRequest();
        $request = $request->withParsedBody($data);

        $config = [
            'key' => '1a03b7bcf2752c8c8a1b46616b0c12658d2c7643403e655450bedb7c78bb2d2f659c2ff4e647e4ea72d37ef6745ebda6733c7b859439107069f291cda98f4844',
        ];

        $mailer = $this->createMock(Mailer::class);

        $messageQueuer = $this->createMock(MessageQueuer::class);
        $messageQueuer->expects(self::any())
            ->method('getAllEmailsToNotify')
            ->willReturn(['administrator@example.com']);
        if ($expectedViewModel['message']['status'] === 'success') {
            $messageQueuer->expects(self::once())->method('queueUserValidatedOrder')->willReturn(new Message());
            $messageQueuer->expects(self::once())->method('queueAdminValidatedOrder')->willReturn(new Message());
        }

        $handler = new DatatransHandler(_em(), $renderer, $config, $mailer, $messageQueuer);
        $handler->handle($request);

        $orderId = $data['refno'] ?? null;
        if ($orderId) {
            $expectedStatus = $expectedViewModel['message']['status'] === 'success' || $orderId === '16002' ? Order::STATUS_VALIDATED : Order::STATUS_PENDING;
            $actualStatus = _em()->getConnection()->fetchColumn('SELECT status FROM `order` WHERE id = ' . $orderId);
            self::assertSame($expectedStatus, $actualStatus);
        }

        self::assertTrue(true); // Workaround when we only assert via mock
    }

    public function providerProcess(): array
    {
        return [
            'normal' => [
                [
                    'uppTransactionId' => '123456789012345678',
                    'status' => 'success',
                    'refno' => '16001',
                    'amount' => '1000',
                    'currency' => 'CHF',
                    'responseMessage' => 'Payment was successful',
                    'sign' => 'c0a817ad85a2bc830f8fd9d4f1cd0f3a2a8757239f98ec1700a182e7f182c6a7',
                ],
                [
                    'message' => [
                        'status' => 'success',
                        'message' => 'Payment was successful',
                    ],
                ],
            ],
            'invalid HMAC signature' => [
                [
                    'uppTransactionId' => '123456789012345678',
                    'status' => 'success',
                    'refno' => '16001',
                    'amount' => '1000',
                    'currency' => 'CHF',
                    'responseMessage' => 'Payment was successful',
                    'sign' => 'a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0',
                ],
                [
                    'message' => [
                        'status' => 'error',
                        'message' => 'Invalid HMAC signature',
                    ],
                ],
            ],
            'missing HMAC signature' => [
                [
                    'uppTransactionId' => '123456789012345678',
                    'status' => 'success',
                    'refno' => '16001',
                    'amount' => '1000',
                    'currency' => 'CHF',
                    'responseMessage' => 'Payment was successful',
                ],
                [
                    'message' => [
                        'status' => 'error',
                        'message' => 'Missing HMAC signature',
                    ],
                ],
            ],
            'error' => [
                [
                    'uppTransactionId' => '876543210987654321',
                    'status' => 'error',
                    'refno' => '16001',
                    'errorMessage' => 'Dear Sir/Madam, Fire! fire! help me! All the best, Maurice Moss.',
                    'sign' => '8015e6fef2caf41bb11cd2f54077bedb6339bd1aecf418091f77662ee13f81eb',
                ],
                [
                    'message' => [
                        'status' => 'error',
                        'message' => 'Dear Sir/Madam, Fire! fire! help me! All the best, Maurice Moss.',
                    ],
                ],
            ],
            'cancel' => [
                [
                    'uppTransactionId' => '876543210987654321',
                    'status' => 'cancel',
                    'refno' => '16001',
                    'sign' => '8015e6fef2caf41bb11cd2f54077bedb6339bd1aecf418091f77662ee13f81eb',
                ],
                [
                    'message' => [
                        'status' => 'cancel',
                        'message' => 'Cancelled',
                    ],
                ],
            ],
            'invalid body' => [
                null,
                [
                    'message' => [
                        'status' => 'error',
                        'message' => 'Parsed body is expected to be an array but got: NULL',
                    ],
                ],
            ],
            'invalid status' => [
                [
                    'uppTransactionId' => '123456789012345678',
                    'status' => 'non-existing-status',
                    'refno' => '16001',
                    'amount' => '10000',
                    'currency' => 'CHF',
                    'responseMessage' => 'Payment was successful',
                    'sign' => '811cb0cd3333311a242adb9907052b74d1c462fb94b071ef4d8790faa7f7fd72',
                ],
                [
                    'message' => [
                        'status' => 'error',
                        'message' => 'Unsupported status in Datatrans data: non-existing-status',
                    ],
                ],
            ],
            'non-existing order' => [
                [
                    'uppTransactionId' => '123456789012345678',
                    'status' => 'success',
                    'amount' => '10000',
                    'currency' => 'CHF',
                    'responseMessage' => 'Payment was successful',
                    'sign' => 'd7f9a1716b1538e2cd8f239230526435bc0dcf289a1769f7426badcbaa0efbc8',
                ],
                [
                    'message' => [
                        'status' => 'error',
                        'message' => 'Cannot validate an order without a valid order ID',
                    ],
                ],
            ],
            'non-existing amount' => [
                [
                    'uppTransactionId' => '123456789012345678',
                    'status' => 'success',
                    'refno' => '16001',
                    'currency' => 'CHF',
                    'responseMessage' => 'Payment was successful',
                    'sign' => 'd3f6f15797038879787e6d79e8041a7e9a9cb5cd1d7c5dabdd62ac8d3052db34',
                ],
                [
                    'message' => [
                        'status' => 'error',
                        'message' => 'Cannot validate an order without an amount',
                    ],
                ],
            ],
            'invalid currency' => [
                [
                    'uppTransactionId' => '123456789012345678',
                    'status' => 'success',
                    'refno' => '16001',
                    'amount' => '10000',
                    'currency' => 'USD',
                    'responseMessage' => 'Payment was successful',
                    'sign' => '8583b8d14fb4efa85d905ad8646074ce3ce1abe16464299e116e4cb68dd44752',
                ],
                [
                    'message' => [
                        'status' => 'error',
                        'message' => 'Can only accept payment in CHF or EUR, but got: USD',
                    ],
                ],
            ],
            'incorrect amount' => [
                [
                    'uppTransactionId' => '123456789012345678',
                    'status' => 'success',
                    'refno' => '16001',
                    'amount' => '1111',
                    'currency' => 'CHF',
                    'responseMessage' => 'Payment was successful',
                    'sign' => '2f2bb61733d8b95101c8c938290acf0efb17daf359266262d73b67165c3ce30b',
                ],
                [
                    'message' => [
                        'status' => 'error',
                        'message' => 'Cannot validate an order with incorrect balance. Expected 10.00 CHF, or 0.00 EUR, but got: 11.11 CHF',
                    ],
                ],
            ],
            'incorrect payment method' => [
                [
                    'uppTransactionId' => '123456789012345678',
                    'status' => 'success',
                    'refno' => '16003',
                    'amount' => '10000',
                    'currency' => 'CHF',
                    'responseMessage' => 'Payment was successful',
                    'sign' => '3111e1c3e63a77a13d9ae067690d52523c00c992b7aba262ab41de7f6e81bdad',
                ],
                [
                    'message' => [
                        'status' => 'error',
                        'message' => 'Cannot validate an order whose payment method is: ebanking',
                    ],
                ],
            ],
            'incorrect status' => [
                [
                    'uppTransactionId' => '123456789012345678',
                    'status' => 'success',
                    'refno' => '16002',
                    'amount' => '10000',
                    'currency' => 'CHF',
                    'responseMessage' => 'Payment was successful',
                    'sign' => 'f19af94a1cafd91e8da390308e2d4a1f8bfc4ac1e2e18cf2963e1de63cec37f8',
                ],
                [
                    'message' => [
                        'status' => 'error',
                        'message' => 'Cannot validate an order which is already validated',
                    ],
                ],
            ],
        ];
    }
}
