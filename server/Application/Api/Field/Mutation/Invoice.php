<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Exception;
use Application\Api\Field\FieldInterface;
use Application\Model\User;
use Application\Service\Invoicer;
use GraphQL\Type\Definition\Type;
use Zend\Expressive\Session\SessionInterface;

abstract class Invoice implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'invoice',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Create transactions and send a notification to invoice the given user. It may do nothing at all if not necessary',
            'args' => [
                'id' => Type::nonNull(_types()->getId(User::class)),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): bool {
                global $container;

                // TODO: poor way to do ACL check, we should find something better integrated in real ACL
                $user = User::getCurrent();
                if (!$user || !in_array($user->getRole(), [User::ROLE_RESPONSIBLE, User::ROLE_ADMINISTRATOR], true)) {
                    throw new Exception('Not allowed to send invoices');
                }

                /** @var Invoicer $invoicer */
                $invoicer = $container->get(Invoicer::class);
                $userToInvoice = $args['id']->getEntity();

                $invoicer->invoice($userToInvoice);

                return true;
            },
        ];
    }
}
