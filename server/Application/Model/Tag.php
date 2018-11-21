<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasName;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * A tag
 *
 * @ORM\Entity(repositoryClass="Application\Repository\TagRepository")
 * @ORM\Table(uniqueConstraints={
 *     @ORM\UniqueConstraint(name="unique_name", columns={"name"})
 * })
 */
class Tag extends AbstractModel
{
    use HasName;

    /**
     * Hexadecimal code
     *
     * @var string
     * @ORM\Column(type="string", length=25, options={"default" = ""})
     */
    private $color = '';

    /**
     * @var Collection
     * @ORM\ManyToMany(targetEntity="Application\Model\Resource", inversedBy="tags")
     */
    private $resources;

    /**
     * @var Collection
     * @ORM\ManyToMany(targetEntity="Application\Model\User", inversedBy="tags")
     */
    private $users;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->resources = new ArrayCollection();
        $this->users = new ArrayCollection();
    }

    /**
     * @return Collection
     */
    public function getResources(): Collection
    {
        return $this->resources;
    }

    /**
     * Add resource
     *
     * @param resource $resource
     */
    public function addResource(Resource $resource): void
    {
        if (!$this->resources->contains($resource)) {
            $this->resources->add($resource);
        }
    }

    /**
     * @return Collection
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    /**
     * Add user
     *
     * @param user $user
     */
    public function addUser(User $user): void
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
        }
    }

    /**
     * Remove user
     *
     * @param user $user
     */
    public function removeUser(User $user): void
    {
        $this->users->removeElement($user);
    }

    /**
     * @param string $color
     */
    public function setColor(string $color): void
    {
        $this->color = $color;
    }

    /**
     * @return string
     */
    public function getColor(): string
    {
        return $this->color;
    }

    /**
     * Remove resource
     *
     * @param resource $resource
     */
    public function removeResource(Resource $resource): void
    {
        $this->resources->removeElement($resource);
    }
}
