<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Enum\DoorType;
use Application\Api\Exception;
use Application\Api\Field\FieldInterface;
use Application\Model\User;
use GraphQL\Type\Definition\Type;
use Zend\Expressive\Session\SessionInterface;
use Zend\Http\Client;
use Zend\Http\Request;

abstract class OpenDoor implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'openDoor',
            'type' => Type::nonNull(Type::string()),
            'description' => 'Open a door at the premises',
            'args' => [
                'door' => Type::nonNull(_types()->get(DoorType::class)),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): string {
                global $container;

                if (!preg_match('/door([0-9]+)/', $args['door'], $m)) {
                    throw new Exception("La porte demandée n'existe pas");
                }
                $doorIndex = $m[1];

                $user = User::getCurrent();
                if ($user && $user->isActive()) {
                    if (!$user->{'isDoor' . $doorIndex}()) {
                        throw new Exception("La porte demandée ne peut être ouverte par l'utilisateur");
                    }
                    $apiConfig = $container->get('config')['doorsApi'];
                    $request = new Request();
                    $request->getHeaders()->addHeaders(['Content-Type' => 'application/json']);
                    $request->setUri($apiConfig['endpoint'] . '/open');
                    $request->setMethod(Request::METHOD_POST);
                    $request->setContent(json_encode([
                        'door' => $doorIndex,
                        'token' => $apiConfig['token'],
                    ]));

                    $client = new Client();

                    try {
                        $response = $client->dispatch($request);
                    } catch (\Zend\Http\Client\Exception\RuntimeException $e) {
                        throw new Exception('Commande de porte inaccessible: ' . $e->getMessage());
                    }
                    $content = json_decode($response->getContent());
                    if ($response->getStatusCode() === 200) {
                        return $content->message;
                    }
                    $errorMsg = $content->message ?? 'Erreur de commande de porte: ' . $response->getStatusCode() . ' ' . $response->getReasonPhrase();

                    throw new Exception($errorMsg);
                }
            },
        ];
    }
}
