<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Exception;
use Application\Api\Field\FieldInterface;
use Application\Api\Helper;
use Application\Model\User;
use Application\Repository\UserRepository;
use GraphQL\Type\Definition\Type;
use Zend\Expressive\Session\SessionInterface;

abstract class ConfirmRegistration implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'confirmRegistration',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'First step to register as a new user.',
            'args' => [
                'token' => Type::nonNull(_types()->get('Token')),
                'input' => Type::nonNull(_types()->get('ConfirmRegistrationInput')),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): bool {

                /** @var UserRepository $repository */
                $repository = _em()->getRepository(User::class);

                /** @var User $user */
                $repository->getAclFilter()->setEnabled(false);
                $user = $repository->findOneByToken($args['token']);
                $repository->getAclFilter()->setEnabled(true);

                if (!$user || !$user->isTokenValid()) {
                    throw new Exception('Cannot confirm registration with an invalid token');
                }

                // Do it
                $input = $args['input'];
                Helper::hydrate($user, $input);

                // Active the member
                $user->initialize();

                // Login
                User::setCurrent($user);

                _em()->flush();

                return true;
            },
        ];
    }
}
