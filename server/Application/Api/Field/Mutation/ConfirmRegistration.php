<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Helper;
use Application\DBAL\Types\ProductTypeType;
use Application\Model\Organization;
use Application\Model\User;
use Application\Repository\OrganizationRepository;
use Application\Repository\UserRepository;
use Application\Service\MessageQueuer;
use Ecodev\Felix\Api\Exception;
use Ecodev\Felix\Api\Field\FieldInterface;
use Ecodev\Felix\Service\Mailer;
use GraphQL\Type\Definition\Type;
use Mezzio\Session\SessionInterface;

abstract class ConfirmRegistration implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'confirmRegistration',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Second step to register as a new user.',
            'args' => [
                'token' => Type::nonNull(_types()->get('Token')),
                'input' => Type::nonNull(_types()->get('ConfirmRegistrationInput')),
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
                $user = $repository->getAclFilter()->runWithoutAcl(function () use ($repository, $args) {
                    return $repository->findOneByToken($args['token']);
                });

                if (!$user) {
                    throw new Exception('Cannot confirm registration with an invalid token');
                }

                if (!$user->isTokenValid()) {
                    throw new Exception('Le lien que vous avez suivi est périmé. Veuillez effectuer une nouvelle demande.');
                }

                $input = $args['input'];

                // Do it
                Helper::hydrate($user, $input);

                // Active the member
                $user->initialize();

                // Give user automatic access via organization
                /** @var OrganizationRepository $organizationRepository */
                $organizationRepository = _em()->getRepository(Organization::class);
                $organization = $organizationRepository->getBestMatchingOrganization($user->getEmail());
                if ($organization) {
                    $user->setSubscriptionLastReview($organization->getSubscriptionLastReview());
                    $user->setSubscriptionType(ProductTypeType::DIGITAL);
                }

                // Login
                User::setCurrent($user);

                _em()->flush();

                /** @var UserRepository $repository */
                $repository = _em()->getRepository(User::class);
                $admins = $repository->getAllAdministratorsToNotify();
                foreach ($admins as $admin) {
                    $message = $messageQueuer->queueConfirmedRegistration($admin, $user);
                    $mailer->sendMessageAsync($message);
                }

                return true;
            },
        ];
    }
}
