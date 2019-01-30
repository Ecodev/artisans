<?php

declare(strict_types=1);

namespace Application\Api\Scalar;

class PasswordType extends AbstractStringBasedType
{
    /**
     * @var string
     */
    public $description = 'A password is a string of at least 10 characters, and including at least one letter and one non-letter';

    /**
     * Validate a token
     *
     * @param mixed $value
     *
     * @return bool
     */
    protected function isValid($value): bool
    {
        return is_string($value)
            && mb_strlen($value) >= 10
            && preg_match('~[a-z]~i', $value)
            && preg_match('~[^a-z ]~i', $value);
    }
}
