<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Cake\Chronos\Chronos;
use Doctrine\DBAL\Platforms\AbstractPlatform;

class ChronosType extends \Doctrine\DBAL\Types\DateTimeType
{
    /**
     * {@inheritdoc}
     */
    public function convertToPHPValue($value, AbstractPlatform $platform)
    {
        if ($value === null || $value instanceof Chronos) {
            return $value;
        }

        $val = new Chronos($value);

        return $val;
    }
}
