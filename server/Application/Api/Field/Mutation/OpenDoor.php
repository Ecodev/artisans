<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Enum\DoorType;
use Application\Api\Exception;
use Application\Api\Field\FieldInterface;
use Application\Api\Output\OpenDoorType;
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
            'type' => Type::nonNull(_types()->get(OpenDoorType::class)),
            'description' => 'Open a door at the premises',
            'args' => [
                'door' => Type::nonNull(_types()->get(DoorType::class)),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): array {
                global $container;

                if (!preg_match('/door([1-4])/', $args['door'], $m)) {
                    throw new Exception("La porte demandée n'existe pas");
                }
                $doorIndex = $m[1];

                $user = User::getCurrent();
                if (!$user || !$user->getCanOpenDoor($args['door'])) {
                    throw new Exception("Vous n'avez pas le droit d'ouvrir la porte, assurez-vous d'être connecté au Wi-Fi du local Emmy");
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
                    // No answer from the web server
                    throw new Exception('Commande de porte temporairement inaccessible, veuillez essayez plus tard ou contacter un administrateur');
                }
                $content = json_decode($response->getContent(), true);
                if ($response->getStatusCode() === 200) {
                    return $content;
                }
                if (preg_match('/^5[0-9]{2}/', (string) $response->getStatusCode())) {
                    $errorMsg = "Commande de porte inaccessible en raison d'une erreur serveur, veuillez essayez plus tard ou contacter un administrateur";
                } else {
                    $errorMsg = $content['message'] ?? 'Erreur de commande de porte, veuillez essayez plus tard ou contact un administrateur';
                }

                throw new Exception($errorMsg);
            },
        ];
    }
}
