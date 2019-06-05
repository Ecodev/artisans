<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Api\Helper;
use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\Transaction;
use GraphQL\Type\Definition\Type;

abstract class DeleteTransactions implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'deleteTransactions',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Delete one or several existing transaction with all its transaction lines, order, order lines and stock movements',
            'args' => [
                'ids' => Type::nonNull(Type::listOf(Type::nonNull(_types()->getId(Transaction::class)))),
            ],
            'resolve' => function ($root, array $args): bool {
                foreach ($args['ids'] as $id) {

                    /** @var Transaction $transaction */
                    $transaction = $id->getEntity();

                    // Check ACL
                    Helper::throwIfDenied($transaction, 'delete');

                    /** @var Order $order */
                    $order = _em()->getRepository(Order::class)->findOneByTransaction($transaction);

                    // Remove all stockMovement via `remove()` to trigger product quantity re-computation in StockMovementUpdater
                    if ($order) {
                        /** @var OrderLine $line */
                        foreach ($order->getOrderLines() as $line) {
                            $stockMovement = $line->getStockMovement();
                            if ($stockMovement) {
                                _em()->remove($stockMovement);
                            }
                        }
                    }

                    // Do it
                    _em()->remove($transaction);
                }

                _em()->flush();

                return true;
            },
        ];
    }
}
