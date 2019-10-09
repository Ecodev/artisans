<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasDate;
use Application\Traits\HasDescription;
use Application\Traits\HasName;
use Doctrine\ORM\Mapping as ORM;

/**
 * A news
 *
 * @ORM\Entity(repositoryClass="Application\Repository\EventRepository")
 */
class Event extends AbstractModel
{
    private const IMAGE_PATH = 'htdocs/news/';

    use HasName;
    use HasDescription;
    use HasDate;
}
