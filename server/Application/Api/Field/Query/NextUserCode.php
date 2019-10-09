<?php

declare(strict_types=1);

namespace Application\Api\Field\Query;

use Application\Api\Field\FieldInterface;
use Application\Model\User;
use Application\Repository\UserRepository;
use GraphQL\Type\Definition\Type;

abstract class NextUserCode implements FieldInterface
{
    public static function build(): array
    {
        return
            [
                'name' => 'nextUserCode',
                'type' => Type::nonNull(Type::int()),
                'description' => 'Next available user code for creation',
                'args' => [],
                'resolve' => function ($root, array $args): int {
                    /** @var UserRepository $repository */
                    $repository = _em()->getRepository(User::class);

                    return $repository->getNextCodeAvailable();
                },
            ];
    }
}
