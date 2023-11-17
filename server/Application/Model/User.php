<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Api\Enum\UserRoleType;
use Application\Api\Input\Operator\RegexpOperatorType;
use Application\DBAL\Types\MembershipType;
use Application\Repository\LogRepository;
use Application\Repository\UserRepository;
use Application\Service\Role;
use Application\Traits\HasAddress;
use Application\Traits\HasSubscriptionLastReview;
use Application\Traits\IsImportable;
use Cake\Chronos\Chronos;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Api\Exception;
use Ecodev\Felix\Api\Scalar\EmailType;
use Ecodev\Felix\Model\CurrentUser;
use Ecodev\Felix\Model\Traits\HasPassword;
use GraphQL\Doctrine\Attribute as API;

/**
 * User.
 */
#[API\Filter(field: 'custom', operator: RegexpOperatorType::class, type: 'string')]
#[ORM\Entity(UserRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ORM\AssociationOverrides([new ORM\AssociationOverride(name: 'owner', inversedBy: 'users')])]
class User extends AbstractModel implements \Ecodev\Felix\Model\HasPassword, \Ecodev\Felix\Model\User
{
    final public const ROLE_ANONYMOUS = 'anonymous';
    final public const ROLE_MEMBER = 'member';
    final public const ROLE_FACILITATOR = 'facilitator';
    final public const ROLE_ADMINISTRATOR = 'administrator';

    use HasAddress;
    use HasPassword;
    use HasSubscriptionLastReview;
    use IsImportable;

    private static ?User $currentUser = null;

    /**
     * Set currently logged in user
     * WARNING: this method should only be called from \Application\Authentication\AuthenticationListener.
     */
    public static function setCurrent(?self $user): void
    {
        self::$currentUser = $user;

        // Initialize ACL filter with current user if a logged in one exists
        /** @var UserRepository $userRepository */
        $userRepository = _em()->getRepository(self::class);
        $aclFilter = $userRepository->getAclFilter();
        $aclFilter->setUser($user);

        CurrentUser::set($user);
    }

    /**
     * Returns currently logged user or null.
     */
    public static function getCurrent(): ?self
    {
        return self::$currentUser;
    }

    #[ORM\Column(type: 'string', length: 191, unique: true)]
    private ?string $email = null;

    #[ORM\Column(type: 'UserRole', options: ['default' => self::ROLE_MEMBER])]
    private string $role = self::ROLE_MEMBER;

    #[ORM\Column(type: 'Membership', options: ['default' => MembershipType::NONE])]
    private string $membership = MembershipType::NONE;

    #[ORM\Column(type: 'ProductType', nullable: true)]
    private ?string $subscriptionType = null;

    #[ORM\Column(type: 'string', length: 25, options: ['default' => ''])]
    private string $phone = '';

    #[ORM\Column(type: 'boolean', options: ['default' => 0])]
    private bool $webTemporaryAccess = false;

    #[ORM\Column(type: 'boolean', options: ['default' => 0])]
    private bool $isPublicFacilitator = false;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?Chronos $firstLogin = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?Chronos $lastLogin = null;

    /**
     * @var Collection<Session>
     */
    #[ORM\ManyToMany(targetEntity: Session::class, mappedBy: 'facilitators')]
    private Collection $sessions;

    /**
     * @var Collection<User>
     */
    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'owner')]
    private Collection $users;

    /**
     * @param string $role role for new user
     */
    public function __construct(string $role = self::ROLE_MEMBER)
    {
        $this->role = $role;
        $this->sessions = new ArrayCollection();
        $this->users = new ArrayCollection();
    }

    /**
     * Get full name.
     */
    public function getName(): string
    {
        return implode(' ', array_filter([$this->getFirstName(), $this->getLastName()]));
    }

    /**
     * Set email.
     */
    #[API\Input(type: EmailType::class)]
    public function setEmail(?string $email): void
    {
        $this->email = $email;
    }

    /**
     * Get email.
     */
    #[API\Field(type: EmailType::class)]
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * Use email as a technical identifier of user.
     */
    #[API\Exclude]
    public function getLogin(): ?string
    {
        return $this->getEmail();
    }

    /**
     * Get the user role.
     */
    #[API\Field(type: UserRoleType::class)]
    public function getRole(): string
    {
        return $this->role;
    }

    /**
     * Sets the user role.
     */
    #[API\Input(type: UserRoleType::class)]
    public function setRole(string $role): void
    {
        if (!Role::canUpdate(self::getCurrent(), $this->role, $role)) {
            $currentRole = self::getCurrent() ? self::getCurrent()->getRole() : self::ROLE_ANONYMOUS;

            throw new Exception($currentRole . ' is not allowed to change role from ' . $this->role . ' to ' . $role);
        }

        $this->role = $role;
    }

    public function initialize(): void
    {
        $this->role = self::ROLE_MEMBER; // Bypass security
    }

    public function getPhone(): string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): void
    {
        $this->phone = $phone;
    }

    public function getSessions(): Collection
    {
        return $this->sessions;
    }

    /**
     * Notify the user that it has a new session.
     * This should only be called by Session::addFacilitator().
     */
    public function sessionAdded(Session $session): void
    {
        $this->sessions->add($session);
    }

    /**
     * Notify the user that a session was removed.
     * This should only be called by Session::removeFacilitator().
     */
    public function sessionRemoved(Session $session): void
    {
        $this->sessions->removeElement($session);
    }

    public function getMembership(): string
    {
        return $this->membership;
    }

    #[API\Exclude]
    public function setMembership(string $membership): void
    {
        $this->membership = $membership;
    }

    public function getWebTemporaryAccess(): bool
    {
        return $this->webTemporaryAccess;
    }

    #[API\Exclude]
    public function setWebTemporaryAccess(bool $webTemporaryAccess): void
    {
        $this->webTemporaryAccess = $webTemporaryAccess;
    }

    public function setIsPublicFacilitator(bool $isPublicFacilitator): void
    {
        $this->isPublicFacilitator = $isPublicFacilitator;
    }

    public function isPublicFacilitator(): bool
    {
        return $this->isPublicFacilitator;
    }

    /**
     * Get the first login date.
     */
    public function getFirstLogin(): ?Chronos
    {
        return $this->firstLogin;
    }

    /**
     * Get the last login date.
     */
    public function getLastLogin(): ?Chronos
    {
        return $this->lastLogin;
    }

    public function recordLogin(): void
    {
        _log()->info(LogRepository::LOGIN);

        $now = new Chronos();
        if (!$this->firstLogin) {
            $this->firstLogin = $now;
        }

        $this->lastLogin = $now;
    }

    /**
     * Override parent to prevents users created from administration to be family of the administrator.
     *
     * The owner must be explicitly set for all users.
     */
    protected function getOwnerForCreation(): ?self
    {
        return null;
    }

    /**
     * Set subscription type.
     */
    #[API\Exclude]
    public function setSubscriptionType(?string $subscriptionType): void
    {
        $this->subscriptionType = $subscriptionType;
    }

    /**
     * Get subscription type.
     */
    #[API\Field(type: '?ProductType')]
    public function getSubscriptionType(): ?string
    {
        return $this->subscriptionType;
    }
}
