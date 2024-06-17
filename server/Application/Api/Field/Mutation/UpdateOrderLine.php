<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Helper;
use Application\Model\OrderLine;
use Application\Service\Invoicer;
use Ecodev\Felix\Api\Field\FieldInterface;
use Ecodev\Felix\Utility;
use GraphQL\Type\Definition\Type;
use Mezzio\Session\SessionInterface;

abstract class UpdateOrderLine implements FieldInterface
{
    public static function build(): iterable
    {
        yield 'updateOrderLine' => fn () => [
            'type' => Type::nonNull(_types()->getOutput(OrderLine::class)),
            'description' => 'Update an existing orderLine.',
            'args' => [
                'id' => Type::nonNull(_types()->getId(OrderLine::class)),
                'input' => Type::nonNull(_types()->get('OrderLineInput')),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): OrderLine {
                global $container;

                /** @var Invoicer $invoicer */
                $invoicer = $container->get(Invoicer::class);

                /** @var OrderLine $orderLine */
                $orderLine = $args['id']->getEntity();
                $args['input'] = Utility::entityIdToModel($args['input']);

                // Check ACL
                Helper::throwIfDenied($orderLine, 'update');

                // Do it
                $invoicer->updateOrderLineAndTransactionLine($orderLine, $args['input']);

                _em()->flush();

                _em()->refresh($orderLine);
                _em()->refresh($orderLine->getOrder());

                return $orderLine;
            },
        ];
    }
}
