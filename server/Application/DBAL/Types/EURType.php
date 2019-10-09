<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\IntegerType;
use Money\Money;

class EURType extends IntegerType
{
    public function getName()
    {
        return 'EUR';
    }

    public function convertToPHPValue($value, AbstractPlatform $platform)
    {
        if ($value === null) {
            return $value;
        }

        $val = Money::EUR($value);

        return $val;
    }

    public function convertToDatabaseValue($value, AbstractPlatform $platform)
    {
        if ($value instanceof Money) {
            return $value->getAmount();
        }

        if ($value === null) {
            return $value;
        }

        throw new \InvalidArgumentException('Cannot convert to dababase value: ' . var_export($value, true));
    }

    public function requiresSQLCommentHint(AbstractPlatform $platform)
    {
        return true;
    }
}
