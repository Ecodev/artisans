<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Acl\Acl;
use Application\Api\Exception;
use Application\DBAL\Types\BillingTypeType;
use Application\DBAL\Types\RelationshipType;
use Application\ORM\Query\Filter\AclFilter;
use Application\Traits\HasAddress;
use Application\Traits\HasDoorAccess;
use Application\Traits\HasRemarks;
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
    const ROLE_BOOKING_ONLY = 'booking_only';
    const ROLE_INDIVIDUAL = 'individual';
    const ROLE_MEMBER = 'member';
    const ROLE_RESPONSIBLE = 'responsible';
    const ROLE_ADMINISTRATOR = 'administrator';

    const STATUS_INACTIVE = 'inactive';
    const STATUS_NEW = 'new';
    const STATUS_ACTIVE = 'active';
    const STATUS_ARCHIVED = 'archived';

    use HasDoorAccess;
    use HasRemarks;
    use HasAddress;

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
     * @var string
     * @ORM\Column(type="string", length=191)
     */
    private $firstName;

    /**
     * @var string
     * @ORM\Column(type="string", length=191)
     */
    private $lastName;

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
     * @ORM\Column(type="UserRole", options={"default" = User::ROLE_INDIVIDUAL})
     */
    private $role = self::ROLE_INDIVIDUAL;

    /**
     * @var string
     * @ORM\Column(type="UserStatus", options={"default" = User::STATUS_NEW})
     */
    private $status = self::STATUS_NEW;

    /**
     * @var null|Chronos
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $lastLogin;

    /**
     * @var null|Chronos
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $welcomeSessionDate;

    /**
     * @var int sex according to ISO/IEC 5218
     * @ORM\Column(type="smallint", options={"default" = 0}))
     */
    private $sex = 0;

    /**
     * @var string
     * @ORM\Column(type="string", length=25, options={"default" = ""})
     */
    private $phone = '';

    /**
     * @var string
     * @ORM\Column(type="string", length=25, options={"default" = ""})
     */
    private $mobilePhone = '';

    /**
     * @var string
     * @ORM\Column(type="string", length=25, options={"default" = ""})
     */
    private $ichtusSwissSailing = '';

    /**
     * @var null|Date
     * @ORM\Column(type="date", nullable=true)
     */
    private $birthday;

    /**
     * @var bool
     * @ORM\Column(type="boolean", options={"default" = 0})
     */
    private $termsAgreement = false;

    /**
     * @var bool
     * @ORM\Column(type="boolean", options={"default" = 0})
     */
    private $hasInsurance = false;

    /**
     * @var bool
     * @ORM\Column(type="boolean", options={"default" = 0})
     */
    private $receivesNewsletter = false;

    /**
     * @var string
     * @ORM\Column(type="Relationship", options={"default" = RelationshipType::HOUSEHOLDER})
     */
    private $familyRelationship = RelationshipType::HOUSEHOLDER;

    /**
     * @var string
     * @ORM\Column(type="BillingType", options={"default" = BillingTypeType::ALL_ELECTRONIC})
     */
    private $billingType = BillingTypeType::ALL_ELECTRONIC;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="Booking", mappedBy="owner")
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
    private $userTags;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="ExpenseClaim", mappedBy="user")
     */
    private $expenseClaims;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="Message", mappedBy="recipient")
     */
    private $messages;

    /**
     * @var Account
     *
     * @ORM\OneToOne(targetEntity="Account", inversedBy="user")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="SET NULL")
     * })
     */
    private $account;

    /**
     * Constructor
     *
     * @param string $role role for new user
     */
    public function __construct(string $role = self::ROLE_INDIVIDUAL)
    {
        $this->role = $role;
        $this->bookings = new ArrayCollection();
        $this->licenses = new ArrayCollection();
        $this->userTags = new ArrayCollection();
        $this->expenseClaims = new ArrayCollection();
        $this->messages = new ArrayCollection();
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
        return (string) $this->login;
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
        return implode(' ', [$this->getFirstName(), $this->getLastName()]);
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
            self::ROLE_INDIVIDUAL,
            self::ROLE_MEMBER,
            self::ROLE_RESPONSIBLE,
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
     * @API\Field(type="Application\Api\Enum\UserStatusType")
     *
     * @return string
     */
    public function getStatus(): string
    {
        return $this->status;
    }

    /**
     * @API\Input(type="Application\Api\Enum\UserStatusType")
     *
     * @param string $status
     */
    public function setStatus(string $status): void
    {
        $this->status = $status;
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
     * @return string
     */
    public function getMobilePhone(): string
    {
        return $this->mobilePhone;
    }

    /**
     * @param string $mobilePhone
     */
    public function setMobilePhone(string $mobilePhone): void
    {
        $this->mobilePhone = $mobilePhone;
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
     * Notify the user that it has a booking was removed.
     * This should only be called by Booking::setResponsible()
     *
     * @param Booking $booking
     */
    public function bookingRemoved(Booking $booking): void
    {
        $this->bookings->removeElement($booking);
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
    public function getUserTags(): Collection
    {
        return $this->userTags;
    }

    /**
     * Notify the user that it has a new license.
     * This should only be called by License::addUser()
     *
     * @param License $license
     */
    public function licenseAdded(License $license): void
    {
        $this->licenses->add($license);
    }

    /**
     * Notify the user that it a license was removed.
     * This should only be called by License::removeUser()
     *
     * @param License $license
     */
    public function licenseRemoved(License $license): void
    {
        $this->licenses->removeElement($license);
    }

    /**
     * Notify the user that it has a new userTag.
     * This should only be called by UserTag::addUser()
     *
     * @param UserTag $userTag
     */
    public function userTagAdded(UserTag $userTag): void
    {
        $this->userTags->add($userTag);
    }

    /**
     * Notify the user that a userTag was removed.
     * This should only be called by UserTag::removeUser()
     *
     * @param UserTag $userTag
     */
    public function userTagRemoved(UserTag $userTag): void
    {
        $this->userTags->removeElement($userTag);
    }

    /**
     * @return bool
     */
    public function isTermsAgreement(): bool
    {
        return $this->termsAgreement;
    }

    /**
     * @param bool $termsAgreement
     */
    public function setTermsAgreement(bool $termsAgreement): void
    {
        $this->termsAgreement = $termsAgreement;
    }

    /**
     * @return bool
     */
    public function getHasInsurance(): bool
    {
        return $this->hasInsurance;
    }

    /**
     * @param bool $hasInsurance
     */
    public function setHasInsurance(bool $hasInsurance): void
    {
        $this->hasInsurance = $hasInsurance;
    }

    /**
     * @return null|Chronos
     */
    public function getWelcomeSessionDate(): ?Chronos
    {
        return $this->welcomeSessionDate;
    }

    /**
     * @param null|Chronos $welcomeSessionDate
     */
    public function setWelcomeSessionDate(?Chronos $welcomeSessionDate): void
    {
        $this->welcomeSessionDate = $welcomeSessionDate;
    }

    /**
     * @return bool
     */
    public function isReceivesNewsletter(): bool
    {
        return $this->receivesNewsletter;
    }

    /**
     * @param bool $receivesNewsletter
     */
    public function setReceivesNewsletter(bool $receivesNewsletter): void
    {
        $this->receivesNewsletter = $receivesNewsletter;
    }

    /**
     * Get the ISO/IEC 5218 sex
     *
     * @API\Field(type="Sex")
     *
     * @return int
     */
    public function getSex(): int
    {
        return $this->sex;
    }

    /**
     * Set the ISO/IEC 5218 sex
     *
     * @API\Input(type="Sex")
     *
     * @param int $sex
     */
    public function setSex(int $sex): void
    {
        $this->sex = $sex;
    }

    /**
     * @return string
     */
    public function getIchtusSwissSailing(): string
    {
        return $this->ichtusSwissSailing;
    }

    /**
     * @param string $ichtusSwissSailing
     */
    public function setIchtusSwissSailing(string $ichtusSwissSailing): void
    {
        $this->ichtusSwissSailing = $ichtusSwissSailing;
    }

    /**
     * Get the last login
     *
     * @return null|Chronos
     */
    public function getLastLogin(): ?Chronos
    {
        return $this->lastLogin;
    }

    /**
     * @param null|Chronos $lastLogin
     */
    public function setLastLogin(?Chronos $lastLogin): void
    {
        $this->lastLogin = $lastLogin;
    }

    /**
     * @API\Field(type="Relationship")
     *
     * @return string
     */
    public function getFamilyRelationship(): string
    {
        return $this->familyRelationship;
    }

    /**
     * @API\Input(type="Relationship")
     *
     * @param string $familyRelationship
     */
    public function setFamilyRelationship(string $familyRelationship): void
    {
        $this->familyRelationship = $familyRelationship;
    }

    /**
     * @return string
     */
    public function getBillingType(): string
    {
        return $this->billingType;
    }

    /**
     * @param string $billingType
     */
    public function setBillingType(string $billingType): void
    {
        $this->billingType = $billingType;
    }

    /**
     * Get the user transaction account
     *
     * @return null|Account
     */
    public function getAccount(): ?Account
    {
        return $this->account;
    }

    /**
     * Assign a transaction account to the user
     *
     * @param null|Account $account
     */
    public function setAccount(?Account $account): void
    {
        $previousAccount = $this->getAccount();

        if ($account) {
            if ($this->getFamilyRelationship() !== RelationshipType::HOUSEHOLDER) {
                throw new Exception('Only the house holder can have an account');
            }
            $account->userAdded($this);
        }

        if ($previousAccount) {
            $previousAccount->setUser(null);
        }

        $this->account = $account;
    }

    /**
     * Get messages sent to the user
     *
     * @return Collection
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    /**
     * Notify the user that it has a new message
     * This should only be called by Message::setRecipient()
     *
     * @param Message $message
     */
    public function messageAdded(Message $message): void
    {
        $this->messages->add($message);
    }

    /**
     * Notify the user that a message was removed
     * This should only be called by Message::setRecipient()
     *
     * @param Message $message
     */
    public function messageRemoved(Message $message): void
    {
        $this->messages->removeElement($message);
    }

    /**
     * Get expense claims submitted by the user
     *
     * @return Collection
     */
    public function getExpenseClaims(): Collection
    {
        return $this->expenseClaims;
    }

    /**
     * Notify the user when a new expense claim was added
     * This should only be called by ExpenseClaim::setUser()
     *
     * @param ExpenseClaim $expense
     */
    public function expenseClaimAdded(ExpenseClaim $expense): void
    {
        $this->expenseClaims->add($expense);
    }

    /**
     * Notify the user that when an expense claim was removed
     * This should only be called by ExpenseClaim::setUser()
     *
     * @param ExpenseClaim $expense
     */
    public function expenseClaimRemoved(ExpenseClaim $expense): void
    {
        $this->expenseClaims->removeElement($expense);
    }
}
