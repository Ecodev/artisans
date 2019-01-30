<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Api\Scalar\PasswordType;
use Application\Api\Scalar\TokenType;
use Application\Model\User;
use Application\Repository\UserRepository;
use GraphQL\Type\Definition\Type;
use Zend\Expressive\Session\SessionInterface;

abstract class UpdatePassword implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'updatePassword',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Update the password for the user identified by the token. Return false if token is invalid',
            'args' => [
                'token' => Type::nonNull(_types()->get(TokenType::class)),
                'password' => Type::nonNull(_types()->get(PasswordType::class)),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): bool {
                /** @var UserRepository $repository */
                $repository = _em()->getRepository(User::class);

                /** @var User $user */
                $repository->getAclFilter()->setEnabled(false);
                $user = $repository->findOneByToken($args['token']);
                $repository->getAclFilter()->setEnabled(true);

                if (!$user || !$user->isTokenValid()) {
                    return false;
                }

                $user->setPassword($args['password']);
                _em()->flush();

                return true;
            },
        ];
    }
}
