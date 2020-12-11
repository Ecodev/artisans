<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Helper;
use Application\DBAL\Types\PaymentMethodType;
use Application\Model\Order;
use Application\Model\User;
use Application\Repository\UserRepository;
use Application\Service\Invoicer;
use Application\Service\MessageQueuer;
use Ecodev\Felix\Api\Field\FieldInterface;
use Ecodev\Felix\Service\Mailer;
use Ecodev\Felix\Utility;
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

                Helper::throwIfDenied(new Order(), 'create');

                $input = $args['input'];
                $input['orderLines'] = array_map(fn ($line) => Utility::entityIdToModel($line), $input['orderLines']);
                $input['country'] = isset($input['country']) ? $input['country']->getEntity() : null;

                /** @var Invoicer $invoicer */
                $invoicer = $container->get(Invoicer::class);
                $order = $invoicer->createOrder($input);

                _em()->flush();

                if ($order) {
                    _em()->refresh($order);

                    // Notify people now if payment is not instantaneous
                    if ($order->getPaymentMethod() !== PaymentMethodType::DATATRANS) {
                        $user = $order->getOwner();
                        if ($user) {
                            $message = $messageQueuer->queueUserPendingOrder($user, $order);
                            $mailer->sendMessageAsync($message);
                        }

                        foreach ($messageQueuer->getAllEmailsToNotify() as $adminEmail) {
                            $message = $messageQueuer->queueAdminPendingOrder($adminEmail, $order);
                            $mailer->sendMessageAsync($message);
                        }
                    }
                }

                return $order;
            },
        ];
    }
}
