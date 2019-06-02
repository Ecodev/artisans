<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Exception;
use Application\Api\Field\FieldInterface;
use Application\Api\Helper;
use Application\Model\Account;
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
                $user = $repository->getAclFilter()->runWithoutAcl(function () use ($repository, $args) {
                    return $repository->findOneByToken($args['token']);
                });

                if (!$user || !$user->isTokenValid()) {
                    throw new Exception('Cannot confirm registration with an invalid token');
                }

                $input = $args['input'];

                $repository->getAclFilter()->runWithoutAcl(function () use ($repository, $input): void {
                    if ($repository->findOneByLogin($input['login'])) {
                        throw new Exception('Ce nom d\'utilisateur est déjà attribué et ne peut être utilisé');
                    }
                });

                // Do it
                Helper::hydrate($user, $input);

                // Active the member
                $user->initialize();

                // Login
                User::setCurrent($user);

                // Create account so he can credit money and start shopping,
                // but only if it's family chief
                if ($user->isFamilyOwner()) {
                    _em()->getRepository(Account::class)->getOrCreate($user);
                }

                _em()->flush();

                return true;
            },
        ];
    }
}
