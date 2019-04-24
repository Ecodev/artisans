<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use GraphQL\Type\Definition\Type;
use Zend\Expressive\Session\SessionInterface;

abstract class CreateOrder implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'createOrder',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Make an order to the shop.',
            'args' => [
                'input' => Type::nonNull(Type::listOf(Type::nonNull(_types()->get('OrderLineInput')))),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): bool {

                // TODO: implement something

                return true;
            },
        ];
    }
}
