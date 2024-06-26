<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Helper;
use Application\Model\User;
use Application\Service\MessageQueuer;
use Ecodev\Felix\Api\Field\FieldInterface;
use Ecodev\Felix\Service\Mailer;
use GraphQL\Type\Definition\Type;
use Mezzio\Session\SessionInterface;

abstract class UpdateUser implements FieldInterface
{
    public static function build(): iterable
    {
        yield 'updateUser' => fn () => [
            'type' => Type::nonNull(_types()->getOutput(User::class)),
            'description' => 'Update an existing orderLine.',
            'args' => [
                'id' => Type::nonNull(_types()->getId(User::class)),
                'input' => Type::nonNull(_types()->getPartialInput(User::class)),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): User {
                global $container;
                /** @var Mailer $mailer */
                $mailer = $container->get(Mailer::class);

                /** @var MessageQueuer $messageQueuer */
                $messageQueuer = $container->get(MessageQueuer::class);

                $user = $args['id']->getEntity();

                // Check ACL
                Helper::throwIfDenied($user, 'update');

                $before = self::privateInformation($user);
                // Do it
                $input = $args['input'];
                Helper::hydrate($user, $input);

                _em()->flush();

                $after = self::privateInformation($user);
                if ($before !== $after) {
                    foreach ($messageQueuer->getAllEmailsToNotify() as $adminEmail) {
                        $message = $messageQueuer->queueUpdatedUser($adminEmail, $user, $before, $after);
                        $mailer->sendMessageAsync($message);
                    }
                }

                return $user;
            },
        ];
    }

    private static function privateInformation(User $user): array
    {
        return [
            'Prénom' => $user->getFirstName(),
            'Nom de famille' => $user->getLastName(),
            'Rue' => $user->getStreet(),
            'NPA' => $user->getPostcode(),
            'Localité' => $user->getLocality(),
            'Pays' => $user->getCountry() ? $user->getCountry()->getName() : null,
            'Téléphone' => $user->getPhone(),
        ];
    }
}
