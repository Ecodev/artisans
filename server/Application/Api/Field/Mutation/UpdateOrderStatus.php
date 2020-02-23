<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Enum\OrderStatusType;
use Application\Api\Field\FieldInterface;
use Application\Model\Order;
use Application\Model\User;
use Application\Repository\UserRepository;
use Application\Service\Mailer;
use Application\Service\MessageQueuer;
use GraphQL\Type\Definition\Type;
use Mezzio\Session\SessionInterface;

abstract class UpdateOrderStatus implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'updateOrderStatus',
            'type' => _types()->getOutput(Order::class),
            'description' => 'Validate an order',
            'args' => [
                'id' => Type::nonNull(_types()->getId(Order::class)),
                'status' => Type::nonNull(_types()->get(OrderStatusType::class)),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): ?Order {
                global $container;

                $status = $args['status'];

                $order = $args['id']->getEntity();
                $order->setStatus($status);

                _em()->flush();
                _em()->refresh($order);

                if ($status === Order::STATUS_VALIDATED) {
                    /** @var Mailer $mailer */
                    $mailer = $container->get(Mailer::class);

                    /** @var MessageQueuer $messageQueuer */
                    $messageQueuer = $container->get(MessageQueuer::class);

                    // Notify user
                    $message = $messageQueuer->queueUserValidatedOrder($order);
                    $mailer->sendMessageAsync($message);

                    // Notify admins
                    /** @var UserRepository $repository */
                    $repository = _em()->getRepository(User::class);
                    $admins = $repository->getAllAdministratorsToNotify();
                    foreach ($admins as $admin) {
                        $message = $messageQueuer->queueAdminValidatedOrder($admin, $order);
                        $mailer->sendMessageAsync($message);
                    }
                }

                return $order;
            },
        ];
    }
}
