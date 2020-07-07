<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Ecodev\Felix\Api\Field\FieldInterface;
use GraphQL\Type\Definition\Type;
use Infomaniak\ClientApiNewsletter\Action;
use Infomaniak\ClientApiNewsletter\Client;

abstract class AddToMailingList implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'addToMailingList',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Subscribe e-mail to infomaniak mailing list',
            'args' => [
                'destination' => Type::nonNull(_types()->get('string')),
                'email' => Type::nonNull(_types()->get('string')),
            ],
            'resolve' => function ($root, array $args): bool {
                global $container;
                $config = $container->get('config');
                $key = $config['infomaniak-api'] ?? null;
                $secret = $config['infomaniak-secret'] ?? null;

                if (!$key || !$secret) {
                    return false;
                }

                $destination = $args['destination'];
                $email = $args['email'];

                $client = new Client($key, $secret);

                $response = $client->post(Client::MAILINGLIST,
                    [
                        'id' => $destination,
                        'action' => Action::IMPORTCONTACT,
                        'params' => [
                            'contacts' => [
                                ['email' => $email],
                            ],
                        ],
                    ]);

                return $response->success();
            },
        ];
    }
}
