<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasColor;
use Application\Traits\HasName;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * Analytic account
 *
 * @ORM\Entity(repositoryClass="Application\Repository\TransactionTagRepository")
 */
class TransactionTag extends AbstractModel
{
    use HasName;
    use HasColor;

    /**
     * @API\Field(type="TransactionLine[]")
     *
     * @return Collection
     */
    public function getTransactionLines(): ArrayCollection
    {
        return new ArrayCollection(_em()->getRepository(TransactionLine::class)->findByTransactionTag($this));
    }
}
