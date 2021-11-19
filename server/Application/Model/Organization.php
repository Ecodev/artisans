<?php

declare(strict_types=1);

namespace Application\Model;

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
 *
 * @ORM\Entity(repositoryClass="Application\Repository\OrganizationRepository")
 *
 * @ORM\Table(uniqueConstraints={
 *     @ORM\UniqueConstraint(name="unique_pattern", columns={"pattern"}, options={"lengths" = {768}}),
 * })
 */
class Organization extends AbstractModel
{
    use HasSubscriptionLastReview;
    use IsImportable;

    /**
     * A regexp pattern that match email address.
     *
     * @var string
     * @ORM\Column(type="text")
     */
    private $pattern;

    public function __construct()
    {
    }

    /**
     * @return Organization
     */
    public function setPattern(string $pattern): self
    {
        $this->pattern = $pattern;

        return $this;
    }
}
