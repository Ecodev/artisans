<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\OrganizationRepository;
use Application\Traits\HasSubscriptionLastReview;
use Application\Traits\IsImportable;
use Doctrine\ORM\Mapping as ORM;

/**
 * An organization.
 *
 * The sole purpose of an organization is to define a pattern that can match email address.
 * When a user is created with a matching email, then he will inherit access from that organization.
 *
 * This only concern digital version, never paper.
 */
#[ORM\UniqueConstraint(name: 'unique_pattern', columns: ['pattern'], options: ['lengths' => [768]])]
#[ORM\Entity(OrganizationRepository::class)]
class Organization extends AbstractModel
{
    use HasSubscriptionLastReview;
    use IsImportable;

    /**
     * A regexp pattern that match email address.
     */
    #[ORM\Column(type: 'text')]
    private string $pattern;

    public function __construct() {}

    public function setPattern(string $pattern): self
    {
        $this->pattern = $pattern;

        return $this;
    }
}
