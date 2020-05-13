<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Model\User;
use Application\Repository\UserRepository;
use Application\Service\MessageQueuer;
use Ecodev\Felix\Api\Field\FieldInterface;
use Ecodev\Felix\Api\Scalar\EmailType;
use Ecodev\Felix\Service\Mailer;
use GraphQL\Type\Definition\Type;
use Mezzio\Session\SessionInterface;

abstract class RequestPasswordReset implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'requestPasswordReset',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Request to send an email to reset the password for the given user. It will **always** return a successful response, even if the user is not found.',
            'args' => [
                'email' => Type::nonNull(_types()->get(EmailType::class)),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): bool {
                global $container;
                /** @var Mailer $mailer */
                $mailer = $container->get(Mailer::class);

                /** @var MessageQueuer $messageQueuer */
                $messageQueuer = $container->get(MessageQueuer::class);

                /** @var UserRepository $repository */
                $repository = _em()->getRepository(User::class);

                /** @var null|User $user */
                $user = $repository->getOneByEmail($args['email']);

                if ($user) {
                    $email = $user->getEmail();

                    if ($email) {
                        $message = $messageQueuer->queueResetPassword($user, $email);
                        $mailer->sendMessageAsync($message);
                    }
                }

                // Here we lie to client, and always say we are successful, to avoid data leak
                return true;
            },
        ];
    }
}
