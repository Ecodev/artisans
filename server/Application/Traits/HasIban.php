<?php

declare(strict_types=1);

namespace Application\Traits;

use Doctrine\DBAL\Exception\InvalidArgumentException;
use Doctrine\ORM\Mapping as ORM;

/**
 * Trait for all objects with an IBAN (international bank account number)
 */
trait HasIban
{
    /**
     * @var string
     *
     * @ORM\Column(type="string", length=34, options={"default" = ""})
     */
    private $iban = '';

    /**
     * Set the IBAN (international bank account number)
     *
     * @param string $iban
     *
     * @throws InvalidArgumentException
     */
    public function setIban(string $iban): void
    {
        $validator = new \Zend\Validator\Iban(['country_code' => 'CH']);
        if (empty($iban)) {
            $this->iban = '';
        } elseif ($validator->isValid($iban)) {
            $this->iban = $iban;
        } else {
            throw new InvalidArgumentException('Invalid IBAN number');
        }
    }

    /**
     * Get the IBAN (international bank account number)
     *
     * @return string
     */
    public function getIban(): string
    {
        return (string) $this->iban;
    }
}
