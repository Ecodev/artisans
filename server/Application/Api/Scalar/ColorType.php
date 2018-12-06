<?php

declare(strict_types=1);

namespace Application\Api\Scalar;

use GraphQL\Error\Error;
use GraphQL\Language\AST\Node;
use GraphQL\Language\AST\StringValueNode;
use GraphQL\Type\Definition\ScalarType;

class ColorType extends ScalarType
{
    /**
     * @var string
     */
    public $description = 'A color expressed in hexadecimal CSS notation (eg: `#AA00FF`) or an empty string `""`.';

    /**
     * Validate a color in hexadecimal CSS notation
     *
     * @param mixed $value
     *
     * @return bool
     */
    private function isValid($value): bool
    {
        return is_string($value) && preg_match('~^(#[[:xdigit:]]{6}|)$~', $value);
    }

    /**
     * Serializes an internal value to include in a response.
     *
     * @param mixed $value
     *
     * @return mixed
     */
    public function serialize($value)
    {
        // Assuming internal representation of url is always correct:
        return $value;
    }

    /**
     * Parses an externally provided value (query variable) to use as an input
     *
     * @param mixed $value
     *
     * @return mixed
     */
    public function parseValue($value)
    {
        if (!$this->isValid($value)) {
            throw new \UnexpectedValueException('Query error: Not a valid color: ' . $value);
        }

        return $value;
    }

    /**
     * Parses an externally provided literal value to use as an input (e.g. in Query AST)
     *
     * @param $ast Node
     * @param null|array $variables
     *
     * @return null|string
     */
    public function parseLiteral($ast, array $variables = null)
    {
        // Note: throwing GraphQL\Error\Error vs \UnexpectedValueException to benefit from GraphQL
        // error location in query:
        if (!($ast instanceof StringValueNode)) {
            throw new Error('Query error: Can only parse strings got: ' . $ast->kind, [$ast]);
        }

        if (!$this->isValid($ast->value)) {
            throw new Error('Query error: Not a valid color', [$ast]);
        }

        return $ast->value;
    }
}
