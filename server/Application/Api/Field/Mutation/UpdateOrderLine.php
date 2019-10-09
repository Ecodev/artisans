<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Api\Helper;
use Application\Model\OrderLine;
use Application\Service\Invoicer;
use GraphQL\Type\Definition\Type;
use Zend\Expressive\Session\SessionInterface;

abstract class UpdateOrderLine implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'updateOrderLine',
            'type' => Type::nonNull(_types()->getOutput(OrderLine::class)),
            'description' => 'Update an existing orderLine.',
            'args' => [
                'id' => Type::nonNull(_types()->getId(OrderLine::class)),
                'input' => Type::nonNull(_types()->getInput(OrderLine::class)),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): OrderLine {
                global $container;

                /** @var Invoicer $invoicer */
                $invoicer = $container->get(Invoicer::class);

                /** @var OrderLine $orderLine */
                $orderLine = $args['id']->getEntity();

                // Check ACL
                Helper::throwIfDenied($orderLine, 'update');

                // Do it
                $input = $args['input'];
                $product = $input['product']->getEntity();
                $quantity = $input['quantity'];
                $isCHF = $input['isCHF'];
                $type = $input['type'];

                $invoicer->updateOrderLineAndTransactionLine($orderLine, $product, $quantity, $isCHF, $type);

                _em()->flush();

                _em()->refresh($orderLine);
                _em()->refresh($orderLine->getOrder());

                return $orderLine;
            },
        ];
    }
}
