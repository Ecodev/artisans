<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Model\User;

trait HasResponsible
{
    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="Application\Model\User")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="SET NULL")
     * })
     */
    private $responsible;

    /**
     * Set responsible
     *
     * @param null|User $responsible
     */
    public function setResponsible(?User $responsible): void
    {
        $this->responsible = $responsible;
    }

    /**
     * Get responsible
     *
     * @return null|User
     */
    public function getResponsible(): ?User
    {
        return $this->responsible;
    }
}
