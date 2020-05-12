<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Model\Log;
use Application\Model\User;
use Application\Repository\LogRepository;
use Application\Repository\UserRepository;
use Ecodev\Felix\Api\Exception;
use Ecodev\Felix\Api\Field\FieldInterface;
use Ecodev\Felix\Api\Scalar\EmailType;
use GraphQL\Type\Definition\Type;
use Mezzio\Session\SessionCookiePersistenceInterface;
use Mezzio\Session\SessionInterface;

abstract class Login implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'login',
            'type' => Type::nonNull(_types()->getOutput(User::class)),
            'description' => 'Log in a user',
            'args' => [
                'email' => Type::nonNull(_types()->get(EmailType::class)),
                'password' => Type::nonNull(Type::string()),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): User {
                /** @var LogRepository $logRepository */
                $logRepository = _em()->getRepository(Log::class);
                if ($logRepository->loginFailedOften()) {
                    throw new Exception("Trop de tentatives d'accès ont échouées. Veuillez ressayer plus tard.");
                }

                // Logout
                $session->clear();
                User::setCurrent(null);

                /** @var UserRepository $userRepository */
                $userRepository = _em()->getRepository(User::class);
                $user = $userRepository->getOneByEmailPassword($args['email'], $args['password']);

                // If we successfully authenticated
                if ($user) {
                    $session->regenerate();
                    $session->set(SessionCookiePersistenceInterface::SESSION_LIFETIME_KEY, 365 * 86400);
                    $session->set('user', $user->getId());
                    User::setCurrent($user);
                    _log()->info(LogRepository::LOGIN);

                    return $user;
                }

                _log()->info(LogRepository::LOGIN_FAILED);

                throw new Exception("L'email ou le mot de passe est incorrect !");
            },
        ];
    }
}
