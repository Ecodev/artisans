<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Api\Helper;
use Application\Model\Product;
use Application\Model\StockMovement;
use GraphQL\Type\Definition\Type;
use Zend\Expressive\Session\SessionInterface;

abstract class CreateStockMovement implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'createStockMovement',
            'type' => Type::nonNull(_types()->getOutput(StockMovement::class)),
            'description' => 'Create stock movement for the given product. A sale or a loss should be a negative delta.',
            'args' => [
                'input' => Type::nonNull(_types()->getInput(StockMovement::class)),
                'product' => Type::nonNull(_types()->getId(Product::class)),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): StockMovement {

                // Do it
                $product = $args['product']->getEntity();
                $stockMovement = new StockMovement();
                $stockMovement->setProduct($product);
                $input = $args['input'];
                Helper::hydrate($stockMovement, $input);

                // Check ACL
                Helper::throwIfDenied($stockMovement, 'create');

                _em()->persist($stockMovement);
                _em()->flush();

                return $stockMovement;
            },
        ];
    }
}
