<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Helper;
use Application\Model\Organization;
use Application\Service\Importer;
use Ecodev\Felix\Api\Field\FieldInterface;
use GraphQL\Type\Definition\Type;
use GraphQL\Upload\UploadType;
use Mezzio\Session\SessionInterface;
use Psr\Http\Message\UploadedFileInterface;

abstract class Import implements FieldInterface
{
    public static function build(): iterable
    {
        yield 'import' => fn () => [
            'type' => Type::nonNull(_types()->get('ImportResult')),
            'description' => 'Import a CSV file containing users',
            'args' => [
                'file' => Type::nonNull(_types()->get(UploadType::class)),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): array {
                // Check ACL
                $fakeOrganization = new Organization();
                Helper::throwIfDenied($fakeOrganization, 'create');

                /** @var UploadedFileInterface $file */
                $file = $args['file'];

                // Move file to tmp dir
                $dir = 'data/tmp/import';
                @mkdir($dir);
                $path = $dir . '/' . uniqid() . '.csv';
                $file->moveTo($path);

                // Do the thing
                $importer = new Importer();
                $result = $importer->import($path);

                return $result;
            },
        ];
    }
}
