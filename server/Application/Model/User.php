<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Acl\Acl;
use Application\Api\Exception;
use Application\ORM\Query\Filter\AclFilter;
use Application\Traits\HasDoorAccess;
use Application\Traits\HasName;
use Application\Traits\HasResponsible;
use Application\Utility;
use Cake\Chronos\Chronos;
use Cake\Chronos\Date;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * User
 *
 * @ORM\Entity(repositoryClass="Application\Repository\UserRepository")
 */
class User extends AbstractModel
{
    const ROLE_ANONYMOUS = 'anonymous';
    const ROLE_INACTIVE = 'inactive';
    const ROLE_BOOKING_ONLY = 'booking_only';
    const ROLE_MEMBER = 'member';
    const ROLE_RESPONSIBLE = 'responsible';
    const ROLE_ADMINISTRATOR = 'administrator';

    use HasName;
    use HasResponsible;
    use HasDoorAccess;

    /**
     * @var User
     */
    private static $currentUser;

    /**
     * Set currently logged in user
     * WARNING: this method should only be called from \Application\Authentication\AuthenticationListener
     *
     * @param \Application\Model\User $user
     */
    public static function setCurrent(?self $user): void
    {
        self::$currentUser = $user;

        // Initalize ACL filter with current user if a logged in one exists
        _em()->getFilters()->getFilter(AclFilter::class)->setUser($user);
    }

    /**
     * Returns currently logged user or null
     *
     * @return null|self
     */
    public static function getCurrent(): ?self
    {
        return self::$currentUser;
    }

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=50, unique=true)
     */
    private $login;

    /**
     * @var null|string
     *
     * @ORM\Column(type="string", length=255)
     */
    private $password;

    /**
     * @var string
     * @ORM\Column(type="string", length=191)
     */
    private $email;

    /**
     * @var string
     * @ORM\Column(type="UserRole", options={"default" = User::ROLE_MEMBER})
     */
    private $role = self::ROLE_MEMBER;

    /**
     * @var Chronos
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $activeUntil;

    /**
     * @var string
     * @ORM\Column(type="string", length=25, options={"default" = ""})
     */
    private $phone = '';

    /**
     * @var null|Date
     * @ORM\Column(type="date", nullable=true)
     */
    private $birthday;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="Booking", mappedBy="responsible")
     */
    private $bookings;

    /**
     * @var Collection
     * @ORM\ManyToMany(targetEntity="License", mappedBy="users")
     */
    private $licenses;

    /**
     * @var Collection
     * @ORM\ManyToMany(targetEntity="UserTag", mappedBy="users")
     */
    private $tags;

    /**
     * Constructor
     *
     * @param string $role role for new user
     */
    public function __construct(string $role = self::ROLE_MEMBER)
    {
        $this->role = $role;
        $this->bookings = new ArrayCollection();
        $this->licenses = new ArrayCollection();
        $this->tags = new ArrayCollection();
    }

    /**
     * Set login (eg: johndoe)
     *
     * @API\Input(type="Application\Api\Scalar\LoginType")
     *
     * @param string $login
     */
    public function setLogin(string $login): void
    {
        $this->login = $login;
    }

    /**
     * Get login (eg: johndoe)
     *
     * @API\Field(type="Application\Api\Scalar\LoginType")
     *
     * @return string
     */
    public function getLogin(): string
    {
        return $this->login;
    }

    /**
     * Encrypt and change the user password
     *
     * @param string $password
     */
    public function setPassword(string $password): void
    {
        // Ignore empty password that could be sent "by mistake" by the client
        // when agreeing to terms
        if ($password === '') {
            return;
        }

        $this->password = password_hash($password, PASSWORD_DEFAULT);
    }

    /**
     * Returns the hashed password
     *
     * @API\Exclude
     *
     * @return null|string
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    /**
     * Set email
     *
     * @API\Input(type="Email")
     *
     * @param string $email
     */
    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    /**
     * Get email
     *
     * @API\Field(type="Email")
     *
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * Returns whether the user is administrator and thus have can do anything.
     *
     * @API\Field(type="Application\Api\Enum\UserRoleType")
     */
    public function getRole(): string
    {
        return $this->role;
    }

    /**
     * Sets the user role
     *
     * The current user is allowed to promote another user up to the same role as himself. So
     * a Senior can promote a Student to Senior. Or an Admin can promote a Junior to Admin.
     *
     * But the current user is **not** allowed to demote a user who has a higher role than himself.
     * That means that a Senior cannot demote an Admin to Student.
     *
     * @param string $role
     */
    public function setRole(string $role): void
    {
        if ($role === $this->role) {
            return;
        }

        $currentRole = self::getCurrent() ? self::getCurrent()->getRole() : self::ROLE_ANONYMOUS;
        $orderedRoles = [
            self::ROLE_ANONYMOUS,
            self::ROLE_MEMBER,
            self::ROLE_ADMINISTRATOR,
        ];

        $newFound = false;
        $oldFound = false;
        foreach ($orderedRoles as $r) {
            if ($r === $this->role) {
                $oldFound = true;
            }
            if ($r === $role) {
                $newFound = true;
            }

            if ($r === $currentRole) {
                break;
            }
        }

        if (!$newFound || !$oldFound) {
            throw new Exception($currentRole . ' is not allowed to change role to ' . $role);
        }

        $this->role = $role;
    }

    /**
     * The date until the user is active. Or `null` if there is not limit in time
     *
     * @return null|Chronos
     */
    public function getActiveUntil(): ?Chronos
    {
        return $this->activeUntil;
    }

    /**
     * The date until the user is active. Or `null` if there is not limit in time
     *
     * @param null|Chronos $activeUntil
     */
    public function setActiveUntil(?Chronos $activeUntil): void
    {
        $this->activeUntil = $activeUntil;
    }

    /**
     * Get a list of global permissions for this user
     *
     * @API\Field(type="GlobalPermissionsList")
     *
     * @return array
     */
    public function getGlobalPermissions(): array
    {
        $acl = new Acl();
        $types = [
            Country::class,
            License::class,
            self::class,
        ];

        $permissions = ['create'];
        $result = [];

        $previousUser = self::getCurrent();
        self::setCurrent($this);
        foreach ($types as $type) {
            $instance = new $type();
            $sh = lcfirst(Utility::getShortClassName($instance));
            $result[$sh] = [];

            foreach ($permissions as $p) {
                $result[$sh][$p] = $acl->isCurrentUserAllowed($instance, $p);
            }
        }

        self::setCurrent($previousUser);

        return $result;
    }

    /**
     * @return string
     */
    public function getPhone(): string
    {
        return $this->phone;
    }

    /**
     * @param string $phone
     */
    public function setPhone(string $phone): void
    {
        $this->phone = $phone;
    }

    /**
     * @return null|Date
     */
    public function getBirthday(): ?Date
    {
        return $this->birthday;
    }

    /**
     * @param null|Date $birthday
     */
    public function setBirthday(?Date $birthday): void
    {
        $this->birthday = $birthday;
    }

    /**
     * Get bookings
     *
     * @return Collection
     */
    public function getBookings(): Collection
    {
        return $this->bookings;
    }

    /**
     * Notify the user that it has a new booking.
     * This should only be called by Booking::setResponsible()
     *
     * @param Booking $booking
     */
    public function bookingAdded(Booking $booking): void
    {
        $this->bookings->add($booking);
    }

    /**
     * @return Collection
     */
    public function getLicenses(): Collection
    {
        return $this->licenses;
    }

    /**
     * @return Collection
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }
}
