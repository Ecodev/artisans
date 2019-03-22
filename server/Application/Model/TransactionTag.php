<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasColor;
use Application\Traits\HasName;
use Doctrine\ORM\Mapping as ORM;

/**
 * Analytic account
 *
 * @ORM\Entity(repositoryClass="Application\Repository\TransactionTagRepository")
 */
class TransactionTag extends AbstractModel
{
    use HasName;
    use HasColor;
}
