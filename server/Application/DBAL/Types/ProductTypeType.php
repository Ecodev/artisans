<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Enum\ProductType;
use Ecodev\Felix\DBAL\Types\PhpEnumType;

class ProductTypeType extends PhpEnumType
{
    protected function getEnumType(): string
    {
        return ProductType::class;
    }
}
