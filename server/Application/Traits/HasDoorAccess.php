<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Model\User;
use Doctrine\ORM\Mapping as ORM;

/**
 * Access to doors
 */
trait HasDoorAccess
{
    /**
     * @var bool
     * @ORM\Column(type="boolean", options={"default" = 1})
     */
    private $door = true;

    /**
     * @return bool
     */
    public function getDoor(): bool
    {
        return $this->door;
    }

    /**
     * @param bool $door
     */
    public function setDoor(bool $door): void
    {
        $this->door = $door;
    }

    /**
     * Check if the user can *really* open the door
     * This also takes into account the user status and role
     *
     * @return bool
     */
    public function getCanOpenDoor(): bool
    {
        $allowedStatus = [User::STATUS_ACTIVE];
        $allowedRoles = [User::ROLE_INDIVIDUAL, User::ROLE_MEMBER, User::ROLE_RESPONSIBLE, User::ROLE_ADMINISTRATOR];

        if (!$this->getDoor()) {
            return false;
        }

        if (!in_array($this->status, $allowedStatus, true) || !in_array($this->role, $allowedRoles, true)) {
            return false;
        }

        return true;
    }
}
