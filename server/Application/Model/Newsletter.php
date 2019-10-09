<?php

declare(strict_types=1);

namespace Application\Model;

use Doctrine\ORM\Mapping as ORM;

/**
 * A list of email to send newsletter to.
 *
 * @ORM\Entity(repositoryClass="Application\Repository\NewsletterRepository")
 */
class Newsletter extends AbstractModel
{
    /**
     * @var string
     * @ORM\Column(type="string", length=191, unique=true)
     */
    private $email;

    /**
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @param string $email
     */
    public function setEmail(string $email): void
    {
        $this->email = $email;
    }
}
