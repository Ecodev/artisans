<?php

declare(strict_types=1);

use Ecodev\Felix\Action\GraphQLAction;
use GraphQL\Upload\UploadMiddleware;
use Mezzio\Application;
use Mezzio\Helper\BodyParams\BodyParamsMiddleware;
use Mezzio\MiddlewareFactory;
use Psr\Container\ContainerInterface;

/**
 * Setup routes with a single request method:
 *
 * $app->get('/', App\Handler\HomePageHandler::class, 'home');
 * $app->post('/album', App\Handler\AlbumCreateHandler::class, 'album.create');
 * $app->put('/album/:id', App\Handler\AlbumUpdateHandler::class, 'album.put');
 * $app->patch('/album/:id', App\Handler\AlbumUpdateHandler::class, 'album.patch');
 * $app->delete('/album/:id', App\Handler\AlbumDeleteHandler::class, 'album.delete');
 *
 * Or with multiple request methods:
 *
 * $app->route('/contact', App\Handler\ContactHandler::class, ['GET', 'POST', ...], 'contact');
 *
 * Or handling all request methods:
 *
 * $app->route('/contact', App\Handler\ContactHandler::class)->setName('contact');
 *
 * or:
 *
 * $app->route(
 *     '/contact',
 *     App\Handler\ContactHandler::class,
 *     Mezzio\Router\Route::HTTP_METHOD_ANY,
 *     'contact'
 * );
 */
return function (Application $app, MiddlewareFactory $factory, ContainerInterface $container): void {
    $app->post('/graphql', [
        BodyParamsMiddleware::class,
        UploadMiddleware::class,
        GraphQLAction::class,
    ], 'graphql');

    $app->get('/image/{id:\d+}[/{maxHeight:\d+}]', [
        \Ecodev\Felix\Action\ImageAction::class,
    ], 'image');

    $app->get('/file/{id:\d+}', [
        \Ecodev\Felix\Action\FileAction::class,
    ], 'file');

    $app->post('/datatrans', [
        BodyParamsMiddleware::class,
        \Application\Action\DatatransAction::class,
    ], 'datatrans');
};
