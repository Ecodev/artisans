<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Api\Scalar\EmailType;
use Application\Model\User;
use Application\Repository\UserRepository;
use Application\Service\Mailer;
use Application\Service\MessageQueuer;
use GraphQL\Type\Definition\Type;
use Mezzio\Session\SessionInterface;

abstract class SubscribeNewsletter implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'subscribeNewsletter',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Subscribe to newsletter.',
            'args' => [
                'email' => Type::nonNull(_types()->get(EmailType::class)),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): bool {
                $email = $args['email'];
                global $container;
                /** @var Mailer $mailer */
                $mailer = $container->get(Mailer::class);

                /** @var MessageQueuer $messageQueuer */
                $messageQueuer = $container->get(MessageQueuer::class);

                /** @var UserRepository $repository */
                $repository = _em()->getRepository(User::class);
                $admins = $repository->getAllAdministratorsToNotify();
                foreach ($admins as $admin) {
                    $message = $messageQueuer->queueNewsletterSubscription($admin, $email);
                    $mailer->sendMessageAsync($message);
                }

                return true;
            },
        ];
    }
}
