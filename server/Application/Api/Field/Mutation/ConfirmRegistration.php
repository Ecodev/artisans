<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Helper;
use Application\Api\Input\ConfirmRegistrationInputType;
use Application\Model\Organization;
use Application\Model\User;
use Application\Repository\OrganizationRepository;
use Application\Repository\UserRepository;
use Application\Service\MessageQueuer;
use Ecodev\Felix\Api\ExceptionWithoutMailLogging;
use Ecodev\Felix\Api\Field\FieldInterface;
use Ecodev\Felix\Api\Scalar\TokenType;
use Ecodev\Felix\Service\Mailer;
use GraphQL\Type\Definition\Type;
use Mezzio\Session\SessionInterface;

abstract class ConfirmRegistration implements FieldInterface
{
    public static function build(): iterable
    {
        yield 'confirmRegistration' => fn () => [
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Second step to register as a new user.',
            'args' => [
                'token' => Type::nonNull(_types()->get(TokenType::class)),
                'input' => Type::nonNull(_types()->get(ConfirmRegistrationInputType::class)),
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
                $user = $repository->getAclFilter()->runWithoutAcl(fn () => $repository->findOneByToken($args['token']));

                if (!$user) {
                    throw new ExceptionWithoutMailLogging('La session a expiré ou le lien n\'est pas valable. Veuillez effectuer une nouvelle demande.');
                }

                if (!$user->isTokenValid()) {
                    throw new ExceptionWithoutMailLogging('Le lien que vous avez suivi est périmé. Veuillez effectuer une nouvelle demande.');
                }

                $input = $args['input'];

                // Do it
                Helper::hydrate($user, $input);

                // Active the member
                $user->initialize();

                // Login
                Login::doLogin($session, $user);

                _em()->flush();

                // Give user automatic access via organization
                /** @var OrganizationRepository $organizationRepository */
                $organizationRepository = _em()->getRepository(Organization::class);
                $organizationRepository->applyOrganizationAccesses();

                foreach ($messageQueuer->getAllEmailsToNotify() as $adminEmail) {
                    $message = $messageQueuer->queueConfirmedRegistration($adminEmail, $user);
                    $mailer->sendMessageAsync($message);
                }

                return true;
            },
        ];
    }
}
