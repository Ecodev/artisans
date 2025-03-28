<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Enum\OrderStatus;
use Application\Model\Order;
use Application\Service\MessageQueuer;
use Ecodev\Felix\Api\Field\FieldInterface;
use Ecodev\Felix\Service\Mailer;
use GraphQL\Type\Definition\Type;
use Mezzio\Session\SessionInterface;

abstract class UpdateOrderStatus implements FieldInterface
{
    public static function build(): iterable
    {
        yield 'updateOrderStatus' => fn () => [
            'type' => Type::nonNull(_types()->getOutput(Order::class)),
            'description' => 'Validate an order',
            'args' => [
                'id' => Type::nonNull(_types()->getId(Order::class)),
                'status' => Type::nonNull(_types()->get(OrderStatus::class)),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): Order {
                global $container;

                $status = $args['status'];

                /** @var Order $order */
                $order = $args['id']->getEntity();
                $order->setStatus($status);

                _em()->flush();
                _em()->refresh($order);

                if ($status === OrderStatus::Validated) {
                    /** @var Mailer $mailer */
                    $mailer = $container->get(Mailer::class);

                    /** @var MessageQueuer $messageQueuer */
                    $messageQueuer = $container->get(MessageQueuer::class);

                    // Notify user
                    $user = $order->getOwner();
                    if ($user) {
                        $message = $messageQueuer->queueUserValidatedOrder($user, $order);
                        $mailer->sendMessageAsync($message);
                    }

                    // Notify admins
                    foreach ($messageQueuer->getAllEmailsToNotify() as $adminEmail) {
                        $message = $messageQueuer->queueAdminValidatedOrder($adminEmail, $order);
                        $mailer->sendMessageAsync($message);
                    }
                }

                return $order;
            },
        ];
    }
}
