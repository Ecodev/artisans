<?php

declare(strict_types=1);

namespace Application\Acl;

use Application\Acl\Assertion\IsMyself;
use Application\Model\AbstractModel;
use Application\Model\Bookable;
use Application\Model\BookableMetadata;
use Application\Model\BookableType;
use Application\Model\Booking;
use Application\Model\Country;
use Application\Model\Image;
use Application\Model\License;
use Application\Model\User;
use Application\Model\UserTag;
use Doctrine\Common\Util\ClassUtils;

class Acl extends \Zend\Permissions\Acl\Acl
{
    /**
     * The message explaining the last denial
     *
     * @var null|string
     */
    private $message;

    public function __construct()
    {
        // Each role is strictly "stronger" than the last one
        $this->addRole(User::ROLE_ANONYMOUS);
        $this->addRole(User::ROLE_INACTIVE, User::ROLE_ANONYMOUS);
        $this->addRole(User::ROLE_BOOKING_ONLY, User::ROLE_INACTIVE);
        $this->addRole(User::ROLE_MEMBER, User::ROLE_BOOKING_ONLY);
        $this->addRole(User::ROLE_RESPONSIBLE, User::ROLE_MEMBER);
        $this->addRole(User::ROLE_ADMINISTRATOR, User::ROLE_RESPONSIBLE);

        $bookable = new ModelResource(Bookable::class);
        $bookableMetadata = new ModelResource(BookableMetadata::class);
        $bookableType = new ModelResource(BookableType::class);
        $booking = new ModelResource(Booking::class);
        $image = new ModelResource(Image::class);
        $license = new ModelResource(License::class);
        $user = new ModelResource(User::class);
        $userTag = new ModelResource(UserTag::class);
        $country = new ModelResource(Country::class);

        $this->addResource($bookable);
        $this->addResource($bookableMetadata);
        $this->addResource($bookableType);
        $this->addResource($booking);
        $this->addResource($image);
        $this->addResource($license);
        $this->addResource($user);
        $this->addResource($userTag);
        $this->addResource($country);

        $this->allow(User::ROLE_ANONYMOUS, [$country, $bookable, $bookableMetadata, $bookableType, $image, $license], ['read']);
        $this->allow(User::ROLE_ANONYMOUS, $user, ['create']);

        $this->allow(User::ROLE_BOOKING_ONLY, $booking, ['create', 'read', 'update']);

        $this->allow(User::ROLE_MEMBER, $user, ['read']);
        $this->allow(User::ROLE_MEMBER, $user, ['update'], new IsMyself());

        $this->allow(User::ROLE_RESPONSIBLE, $user, ['update']);
        $this->allow(User::ROLE_RESPONSIBLE, $userTag, ['create', 'read', 'update', 'delete']);
        $this->allow(User::ROLE_RESPONSIBLE, [$bookable, $bookableMetadata, $bookableType, $image, $license], ['create', 'update', 'delete']);
    }

    /**
     * Return whether the current user is allowed to do something
     *
     * This should be the main method to do all ACL checks.
     *
     * @param AbstractModel $model
     * @param string $privilege
     *
     * @return bool
     */
    public function isCurrentUserAllowed(AbstractModel $model, string $privilege): bool
    {
        $resource = new ModelResource($this->getClass($model), $model);

        $role = $this->getCurrentRole();

        $isAllowed = $this->isAllowed($role, $resource, $privilege);

        $this->message = $this->buildMessage($resource, $privilege, $role, $isAllowed);

        return $isAllowed;
    }

    private function getClass(AbstractModel $resource): string
    {
        return ClassUtils::getRealClass(get_class($resource));
    }

    private function getCurrentRole(): string
    {
        $user = User::getCurrent();
        if (!$user) {
            return 'anonymous';
        }

        return $user->getRole();
    }

    private function buildMessage($resource, ?string $privilege, string $role, bool $isAllowed): ?string
    {
        if ($isAllowed) {
            return null;
        }

        if ($resource instanceof ModelResource) {
            $resource = $resource->getName();
        }

        $user = User::getCurrent() ? 'User "' . User::getCurrent()->getName() . '"' : 'Non-logged user';
        $privilege = $privilege === null ? 'NULL' : $privilege;

        return "$user with role $role is not allowed on resource \"$resource\" with privilege \"$privilege\"";
    }

    /**
     * Returns the message explaining the last denial, if any
     *
     * @return null|string
     */
    public function getLastDenialMessage(): ?string
    {
        return $this->message;
    }
}
