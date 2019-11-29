<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Api\Helper;
use Application\Model\Configuration;
use GraphQL\Type\Definition\Type;
use Zend\Expressive\Session\SessionInterface;

abstract class UpdateConfiguration implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'updateConfiguration',
            'type' => Type::nonNull(Type::string()),
            'description' => 'Update configuration value.',
            'args' => [
                'key' => Type::nonNull(Type::string()),
                'value' => Type::nonNull(Type::string()),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): string {
                $key = $args['key'];
                $value = $args['value'];

                /** @var Configuration $configuration */
                $configuration = _em()->getRepository(Configuration::class)->getOrCreate($key);

                // Check ACL, exceptionally test 'create' privilege instead of 'update'
                Helper::throwIfDenied($configuration, 'create');

                $configuration->setValue($value);

                if (!$configuration->getValue()) {
                    _em()->remove($configuration);
                }

                _em()->flush();

                return $configuration->getValue();
            },
        ];
    }
}
