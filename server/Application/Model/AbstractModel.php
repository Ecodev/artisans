<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Acl\Acl;
use Cake\Chronos\Chronos;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Api\Exception;
use Ecodev\Felix\Model\HasOwner;
use Ecodev\Felix\Model\Model;
use GraphQL\Doctrine\Annotation as API;

/**
 * Base class for all objects stored in database.
 *
 * It includes an automatic mechanism to timestamp objects with date and user.
 *
 * @ORM\MappedSuperclass
 * @ORM\HasLifecycleCallbacks
 * @API\Filters({
 *     @API\Filter(field="custom", operator="Application\Api\Input\Operator\SearchOperatorType", type="string"),
 * })
 * @API\Sorting({
 *     "Application\Api\Input\Sorting\LatestModification",
 *     "Application\Api\Input\Sorting\Owner"
 * })
 */
abstract class AbstractModel implements HasOwner, Model
{
    /**
     * @ORM\Column(type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private ?int $id = null;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private ?\Cake\Chronos\Chronos $creationDate = null;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private ?\Cake\Chronos\Chronos $updateDate = null;

    /**
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="SET NULL")
     * })
     */
    private ?\Application\Model\User $creator = null;

    /**
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="SET NULL")
     * })
     */
    private ?\Application\Model\User $owner = null;

    /**
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="SET NULL")
     * })
     */
    private ?\Application\Model\User $updater = null;

    /**
     * Get id.
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * Set creation date.
     */
    private function setCreationDate(Chronos $creationDate): void
    {
        $this->creationDate = $creationDate;
    }

    /**
     * Get creation date.
     */
    public function getCreationDate(): ?Chronos
    {
        return $this->creationDate;
    }

    /**
     * Set update date.
     */
    private function setUpdateDate(Chronos $updateDate): void
    {
        $this->updateDate = $updateDate;
    }

    /**
     * Get update date.
     */
    public function getUpdateDate(): ?Chronos
    {
        return $this->updateDate;
    }

    /**
     * Set creator.
     */
    private function setCreator(?User $creator): void
    {
        $this->creator = $creator;
    }

    /**
     * Get creator.
     */
    public function getCreator(): ?User
    {
        return $this->creator;
    }

    /**
     * Set owner.
     */
    public function setOwner(?User $owner): void
    {
        if ($owner === $this->owner) {
            return;
        }

        $user = User::getCurrent();
        $isAdmin = $user && $user->getRole() === User::ROLE_ADMINISTRATOR;
        $isOwner = $user === $this->owner;

        if ($this->owner && !$isAdmin && !$isOwner) {
            $currentLogin = $user ? $user->getName() : '[anonymous]';
            $currentOwnerLogin = $this->owner->getName();
            $futureOwnerLogin = $owner ? $owner->getName() : '[nobody]';

            throw new Exception($currentLogin . ' is not allowed to change owner to ' . $futureOwnerLogin . ' because it belongs to ' . $currentOwnerLogin);
        }

        $this->owner = $owner;
    }

    /**
     * Get owner.
     */
    public function getOwner(): ?User
    {
        return $this->owner;
    }

    /**
     * Set updater.
     */
    private function setUpdater(?User $updater): void
    {
        $this->updater = $updater;
    }

    /**
     * Get updater.
     */
    public function getUpdater(): ?User
    {
        return $this->updater;
    }

    /**
     * Get default owner for creation.
     */
    protected function getOwnerForCreation(): ?User
    {
        return User::getCurrent();
    }

    /**
     * Automatically called by Doctrine when the object is saved for the first time.
     *
     * @ORM\PrePersist
     */
    public function timestampCreation(): void
    {
        $this->setCreationDate(new Chronos());
        $this->setCreator(User::getCurrent());

        if (!$this->getOwner()) {
            $this->setOwner($this->getOwnerForCreation());
        }
    }

    /**
     * Automatically called by Doctrine when the object is updated.
     *
     * @ORM\PreUpdate
     */
    public function timestampUpdate(): void
    {
        $this->setUpdateDate(new Chronos());
        $this->setUpdater(User::getCurrent());
    }

    /**
     * Get permissions on this object for the current user.
     *
     * @API\Field(type="Permissions")
     */
    public function getPermissions(): array
    {
        $acl = new Acl();

        return [
            'create' => $acl->isCurrentUserAllowed($this, 'create'),
            'read' => $acl->isCurrentUserAllowed($this, 'read'),
            'update' => $acl->isCurrentUserAllowed($this, 'update'),
            'delete' => $acl->isCurrentUserAllowed($this, 'delete'),
        ];
    }
}
