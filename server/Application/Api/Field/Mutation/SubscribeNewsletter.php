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

                foreach ($messageQueuer->getAllEmailsToNotify() as $adminEmail) {
                    $message = $messageQueuer->queueNewsletterSubscription($adminEmail, $email);
                    $mailer->sendMessageAsync($message);
                }

                return true;
            },
        ];
    }
}
