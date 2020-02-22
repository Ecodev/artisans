<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Model\Order;
use Application\Service\Invoicer;
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

                $input = $args['input'];
                $input['orderLines'] = Utility::entityIdToModel($input['orderLines']);

                /** @var Invoicer $invoicer */
                $invoicer = $container->get(Invoicer::class);
                $order = $invoicer->createOrder($input);

                _em()->flush();

                if ($order) {
                    _em()->refresh($order);
                }

                return $order;
            },
        ];
    }
}
