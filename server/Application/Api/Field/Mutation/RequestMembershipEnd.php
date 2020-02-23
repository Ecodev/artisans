<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Exception;
use Application\Api\Field\FieldInterface;
use Application\Model\User;
use Application\Repository\UserRepository;
use Application\Service\Mailer;
use Application\Service\MessageQueuer;
use GraphQL\Type\Definition\Type;
use Mezzio\Session\SessionInterface;

abstract class RequestMembershipEnd implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'requestMembershipEnd',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Stop the use membership.',
            'args' => [
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): bool {
                $user = User::getCurrent();

                if (!$user || !$user->getMembershipBegin()) {
                    throw new Exception('Must be logged in and have a membership');
                }

                global $container;
                /** @var Mailer $mailer */
                $mailer = $container->get(Mailer::class);

                /** @var MessageQueuer $messageQueuer */
                $messageQueuer = $container->get(MessageQueuer::class);

                /** @var UserRepository $repository */
                $repository = _em()->getRepository(User::class);
                $admins = $repository->getAllAdministratorsToNotify();
                foreach ($admins as $admin) {
                    $message = $messageQueuer->queueRequestMembershipEnd($admin, $user);
                    $mailer->sendMessageAsync($message);
                }

                return true;
            },
        ];
    }
}
