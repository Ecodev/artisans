<?php

declare(strict_types=1);

namespace Application;

use Cake\Chronos\Chronos;

abstract class Utility
{
    /**
     * @var Chronos
     */
    private static $now;

    /**
     * Returns now, always same value for a single PHP execution
     *
     * @return Chronos
     */
    public static function getNow(): Chronos
    {
        if (!self::$now) {
            self::$now = new Chronos();
        }

        return self::$now;
    }

    /**
     * Returns the short class name of any object, eg: Application\Model\Calendar => Calendar
     *
     * @param object $object
     *
     * @return string
     */
    public static function getShortClassName($object): string
    {
        $reflect = new \ReflectionClass($object);

        return $reflect->getShortName();
    }
}
