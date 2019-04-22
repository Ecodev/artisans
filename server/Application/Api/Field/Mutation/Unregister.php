<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Api\Helper;
use Application\Model\User;
use Application\Repository\UserRepository;
use Application\Service\Mailer;
use Application\Service\MessageQueuer;
use GraphQL\Type\Definition\Type;
use Zend\Expressive\Session\SessionInterface;

abstract class Unregister implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'unregister',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Unregister the given user.',
            'args' => [
                'id' => Type::nonNull(_types()->getId(User::class)),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): bool {
                global $container;
                /** @var Mailer $mailer */
                $mailer = $container->get(Mailer::class);

                /** @var MessageQueuer $messageQueuer */
                $messageQueuer = $container->get(MessageQueuer::class);

                /** @var User $user */
                $user = $args['id']->getEntity();

                // Check ACL
                Helper::throwIfDenied($user, 'update');

                $user->setStatus(User::STATUS_ARCHIVED);

                // Force logout if we are unregistering ourselves
                if (User::getCurrent() === $user) {
                    $session->clear();
                    User::setCurrent(null);
                }

                _em()->flush();

                /** @var UserRepository $repository */
                $repository = _em()->getRepository(User::class);
                $admins = $repository->getAllAdministratorsToNotify();
                foreach ($admins as $admin) {
                    $message = $messageQueuer->queueUnregister($admin, $user);
                    $mailer->sendMessageAsync($message);
                }

                return true;
            },
        ];
    }
}
