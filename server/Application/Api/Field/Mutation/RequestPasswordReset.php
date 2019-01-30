<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Api\Scalar\LoginType;
use Application\DBAL\Types\RelationshipType;
use Application\Model\User;
use Application\Repository\UserRepository;
use Application\Service\Mailer;
use GraphQL\Type\Definition\Type;
use Zend\Expressive\Session\SessionInterface;

abstract class RequestPasswordReset implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'requestPasswordReset',
            'type' => Type::nonNull(_types()->get('Relationship')),
            'description' => 'Request to send an email to reset the password for the given user. It will **always** return a successful response, even if the user is not found.',
            'args' => [
                'login' => Type::nonNull(_types()->get(LoginType::class)),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): string {
                global $container;
                /** @var Mailer $mailer */
                $mailer = $container->get(Mailer::class);

                /** @var UserRepository $repository */
                $repository = _em()->getRepository(User::class);

                /** @var User $user */
                $user = $repository->getByLogin($args['login']);
                $relationship = RelationshipType::HOUSEHOLDER;

                if ($user) {
                    $email = $user->getEmail();

                    // Fallback to householder if any
                    if (!$email && $user->getOwner()) {
                        $repository->getAclFilter()->setEnabled(false);
                        $email = $user->getOwner()->getEmail();
                        $repository->getAclFilter()->setEnabled(true);

                        $relationship = $user->getFamilyRelationship();
                    }

                    if ($email) {
                        $message = $mailer->queueResetPassword($user, $email);
                        $mailer->sendMessageAsync($message);
                    }
                }

                // Here we lie to client, and always say we are successful, to avoid data leak
                return $relationship;
            },
        ];
    }
}
