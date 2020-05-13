<?php

declare(strict_types=1);

namespace Application\Model;

use Application\DBAL\Types\MembershipType;
use Application\Repository\LogRepository;
use Application\Repository\UserRepository;
use Application\Traits\HasAddress;
use Application\Traits\HasSubscriptionLastReview;
use Application\Traits\IsImportable;
use Cake\Chronos\Chronos;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Api\Exception;
use Ecodev\Felix\Model\CurrentUser;
use Ecodev\Felix\Model\Traits\HasPassword;
use GraphQL\Doctrine\Annotation as API;

/**
 * User
 *
 * @ORM\Entity(repositoryClass="Application\Repository\UserRepository")
 * @ORM\HasLifecycleCallbacks
 * @ORM\AssociationOverrides({
 *     @ORM\AssociationOverride(name="owner", inversedBy="users")
 * })
 */
class User extends AbstractModel implements \Ecodev\Felix\Model\User, \Ecodev\Felix\Model\HasPassword
{
    const ROLE_ANONYMOUS = 'anonymous';
    const ROLE_MEMBER = 'member';
    const ROLE_FACILITATOR = 'facilitator';
    const ROLE_ADMINISTRATOR = 'administrator';

    use HasAddress;
    use HasSubscriptionLastReview;
    use HasPassword;
    use IsImportable;

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
        /** @var UserRepository $userRepository */
        $userRepository = _em()->getRepository(self::class);
        $aclFilter = $userRepository->getAclFilter();
        $aclFilter->setUser($user);

        CurrentUser::set($user);
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
     * @ORM\Column(type="string", length=191, options={"default" = ""})
     */
    private $firstName = '';

    /**
     * @var string
     * @ORM\Column(type="string", length=191, options={"default" = ""})
     */
    private $lastName = '';

    /**
     * @var string
     * @ORM\Column(type="string", length=191, unique=true)
     */
    private $email;

    /**
     * @var string
     * @ORM\Column(type="UserRole", options={"default" = User::ROLE_MEMBER})
     */
    private $role = self::ROLE_MEMBER;

    /**
     * @var string
     * @ORM\Column(type="Membership", options={"default" = MembershipType::NONE})
     */
    private $membership = MembershipType::NONE;

    /**
     * @var null|string
     * @ORM\Column(type="ProductType", nullable=true)
     */
    private $subscriptionType;

    /**
     * @var string
     * @ORM\Column(type="string", length=25, options={"default" = ""})
     */
    private $phone = '';

    /**
     * @var bool
     * @ORM\Column(type="boolean", options={"default" = 0})
     */
    private $webTemporaryAccess = false;

    /**
     * @var Collection
     * @ORM\ManyToMany(targetEntity="Session", mappedBy="facilitators")
     */
    private $sessions;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="User", mappedBy="owner")
     */
    private $users;

    /**
     * Constructor
     *
     * @param string $role role for new user
     */
    public function __construct(string $role = self::ROLE_MEMBER)
    {
        $this->role = $role;
        $this->sessions = new ArrayCollection();
        $this->users = new ArrayCollection();
    }

    /**
     * Set first name
     *
     * @param string $firstName
     */
    public function setFirstName($firstName): void
    {
        $this->firstName = $firstName;
    }

    /**
     * Get first name
     *
     * @return string
     */
    public function getFirstName(): string
    {
        return (string) $this->firstName;
    }

    /**
     * Set last name
     *
     * @param string $lastName
     */
    public function setLastName($lastName): void
    {
        $this->lastName = $lastName;
    }

    /**
     * Get last name
     *
     * @return string
     */
    public function getLastName(): string
    {
        return (string) $this->lastName;
    }

    /**
     * Get full name
     *
     * @return string
     */
    public function getName(): string
    {
        return implode(' ', array_filter([$this->getFirstName(), $this->getLastName()]));
    }

    /**
     * Set email
     *
     * @API\Input(type="Email")
     *
     * @param string $email
     */
    public function setEmail(?string $email): void
    {
        $this->email = $email;
    }

    /**
     * Get email
     *
     * @API\Field(type="Email")
     *
     * @return null|string
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * Use email as technical identifier of user
     *
     * @API\Exclude
     *
     * @return null|string
     */
    public function getLogin(): ?string
    {
        return $this->getEmail();
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
     * a Responsible can promote a Member to Responsible. Or an Admin can promote a Individual to Admin.
     *
     * But the current user is **not** allowed to demote a user who has a higher role than himself.
     * That means that a Responsible cannot demote an Admin to Individual.
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
            self::ROLE_FACILITATOR,
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
            throw new Exception($currentRole . ' is not allowed to change role from ' . $this->role . ' to ' . $role);
        }

        $this->role = $role;
    }

    public function initialize(): void
    {
        $this->role = self::ROLE_MEMBER; // Bypass security
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
     * @return Collection
     */
    public function getSessions(): Collection
    {
        return $this->sessions;
    }

    /**
     * Notify the user that it has a new session.
     * This should only be called by Session::addFacilitator()
     *
     * @param Session $session
     */
    public function sessionAdded(Session $session): void
    {
        $this->sessions->add($session);
    }

    /**
     * Notify the user that a session was removed.
     * This should only be called by Session::removeFacilitator()
     *
     * @param Session $session
     */
    public function sessionRemoved(Session $session): void
    {
        $this->sessions->removeElement($session);
    }

    /**
     * @return string
     */
    public function getMembership(): string
    {
        return $this->membership;
    }

    /**
     * @API\Exclude
     *
     * @param string $membership
     */
    public function setMembership(string $membership): void
    {
        $this->membership = $membership;
    }

    /**
     * @return bool
     */
    public function getWebTemporaryAccess(): bool
    {
        return $this->webTemporaryAccess;
    }

    /**
     * @API\Exclude
     *
     * @param bool $webTemporaryAccess
     */
    public function setWebTemporaryAccess(bool $webTemporaryAccess): void
    {
        $this->webTemporaryAccess = $webTemporaryAccess;
    }

    /**
     * Get the first login date
     *
     * @return null|Chronos
     */
    public function getFirstLogin(): ?Chronos
    {
        /** @var LogRepository $logRepository */
        $logRepository = _em()->getRepository(Log::class);

        return $logRepository->getLoginDate($this, true);
    }

    /**
     * Get the last login date
     *
     * @return null|Chronos
     */
    public function getLastLogin(): ?Chronos
    {
        /** @var LogRepository $logRepository */
        $logRepository = _em()->getRepository(Log::class);

        return $logRepository->getLoginDate($this, false);
    }

    /**
     * Override parent to prevents users created from administration to be family of the administrator
     *
     * The owner must be explicitly set for all users.
     *
     * @ORM\PrePersist
     */
    public function timestampCreation(): void
    {
        $this->setCreationDate(new Chronos());
        $this->setCreator(self::getCurrent());
    }

    /**
     * Set subscription type
     *
     * @API\Exclude
     *
     * @param null|string $subscriptionType
     */
    public function setSubscriptionType(?string $subscriptionType): void
    {
        $this->subscriptionType = $subscriptionType;
    }

    /**
     * Get subscription type
     *
     * @API\Field(type="?ProductType")
     *
     * @return null|string
     */
    public function getSubscriptionType(): ?string
    {
        return $this->subscriptionType;
    }
}
