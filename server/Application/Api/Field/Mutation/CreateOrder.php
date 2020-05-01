<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\DBAL\Types\PaymentMethodType;
use Application\Model\Order;
use Application\Model\User;
use Application\Repository\UserRepository;
use Application\Service\Invoicer;
use Application\Service\Mailer;
use Application\Service\MessageQueuer;
use Application\Utility;
use GraphQL\Type\Definition\Type;
use Mezzio\Session\SessionInterface;

abstract class CreateOrder implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'createOrder',
            'type' => _types()->getOutput(Order::class),
            'description' => 'Make an order to the shop.',
            'args' => [
                'input' => Type::nonNull(_types()->get('OrderInput')),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): ?Order {
                global $container;
                /** @var Mailer $mailer */
                $mailer = $container->get(Mailer::class);

                /** @var MessageQueuer $messageQueuer */
                $messageQueuer = $container->get(MessageQueuer::class);

                $input = $args['input'];
                $input['orderLines'] = array_map(fn ($line) => Utility::entityIdToModel($line), $input['orderLines']);

                /** @var Invoicer $invoicer */
                $invoicer = $container->get(Invoicer::class);
                $order = $invoicer->createOrder($input);

                _em()->flush();

                if ($order) {
                    _em()->refresh($order);

                    // Notify people now if payment is not instantaneous
                    if ($order->getPaymentMethod() !== PaymentMethodType::DATATRANS) {
                        $message = $messageQueuer->queueUserPendingOrder($order);
                        $mailer->sendMessageAsync($message);

                        /** @var UserRepository $repository */
                        $repository = _em()->getRepository(User::class);
                        $admins = $repository->getAllAdministratorsToNotify();
                        foreach ($admins as $admin) {
                            $message = $messageQueuer->queueAdminPendingOrder($admin, $order);
                            $mailer->sendMessageAsync($message);
                        }
                    }
                }

                return $order;
            },
        ];
    }
}
