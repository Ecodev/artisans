<?php

declare(strict_types=1);

namespace ApplicationTest\Action;

use Application\Action\DatatransAction;
use ApplicationTest\Traits\TestWithTransaction;
use PHPUnit\Framework\TestCase;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\ServerRequest;
use Zend\Expressive\Template\TemplateRendererInterface;

class DatatransActionTest extends TestCase
{
    use TestWithTransaction;

    /**
     * @dataProvider providerProcess
     */
    public function testProcess(array $data, string $expectedAmount, array $expectedViewModel): void
    {
        // Message always include input data
        $expectedViewModel['message']['detail'] = $data;
        $renderer = $this->prophesize(TemplateRendererInterface::class); //; $container->get(TemplateRendererInterface::class);
        $renderer->render('app::datatrans', $expectedViewModel);

        $handler = $this->prophesize(RequestHandlerInterface::class);

        $request = new ServerRequest();
        $request = $request->withParsedBody($data);

        $action = new DatatransAction(_em(), $renderer->reveal());
        $action->process($request, $handler->reveal());

        $userId = $data['refno'];
        if ($userId) {
            $actualBalance = _em()->getConnection()->fetchColumn('SELECT balance FROM account WHERE owner_id = ' . $userId);
            self::assertSame($expectedAmount, $actualBalance);
        }
    }

    public function providerProcess(): array
    {
        return [
            [
                [
                    'uppTransactionId' => '123456789012345678',
                    'status' => 'success',
                    'refno' => '1007',
                    'amount' => '10000',
                    'currency' => 'CHF',
                    'responseMessage' => 'Payment was successful',
                ],
                '100.00',
                [
                    'message' => [
                        'type' => 'success',
                        'message' => 'Payment was successful',
                    ],
                ],
            ],
            [
                [
                    'uppTransactionId' => '123456789012345678',
                    'status' => 'success',
                    'refno' => '1008',
                    'amount' => '10000',
                    'currency' => 'CHF',
                    'responseMessage' => 'Payment was successful',
                ],
                '100.00',
                [
                    'message' => [
                        'type' => 'success',
                        'message' => 'Payment was successful',
                    ],
                ],
            ],
            [
                [
                    'uppTransactionId' => '876543210987654321',
                    'status' => 'error',
                    'refno' => '1007',
                    'errorMessage' => 'Dear Sir/Madam, Fire! fire! help me! All the best, Maurice Moss.',
                ],
                '0.00',
                [
                    'message' => [
                        'type' => 'error',
                        'message' => 'Dear Sir/Madam, Fire! fire! help me! All the best, Maurice Moss.',
                    ],
                ],
            ],
            [
                [
                    'uppTransactionId' => '876543210987654321',
                    'status' => 'cancel',
                    'refno' => '1007',
                ],
                '0.00',
                [
                    'message' => [
                        'type' => 'error',
                        'message' => 'Cancelled',
                    ],
                ],
            ],
        ];
    }
}
