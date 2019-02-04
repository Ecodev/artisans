<?php

declare(strict_types=1);

namespace Application\Api\Field\Query;

use Application\Api\Exception;
use Application\Api\Field\FieldInterface;
use Application\Model\User;
use Application\Repository\UserRepository;
use GraphQL\Type\Definition\Type;

abstract class UserByToken implements FieldInterface
{
    public static function build(): array
    {
        return
            [
                'name' => 'userByToken',
                'type' => Type::nonNull(_types()->getOutput(User::class)),
                'description' => 'Get a user by its temporary token',
                'args' => [
                    'token' => Type::nonNull(_types()->get('Token')),
                ],
                'resolve' => function ($root, array $args): User {
                    /** @var UserRepository $repository */
                    $repository = _em()->getRepository(User::class);

                    /** @var User $user */
                    $repository->getAclFilter()->setEnabled(false);
                    $user = $repository->findOneByToken($args['token']);
                    $repository->getAclFilter()->setEnabled(true);

                    if (!$user || !$user->isTokenValid()) {
                        throw new Exception('User not found for token `' . $args['token'] . '`.');
                    }

                    return $user;
                },
            ];
    }
}
