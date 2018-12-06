<?php

declare(strict_types=1);

namespace Application\Acl;

use Application\Acl\Assertion\IsMyself;
use Application\Model\AbstractModel;
use Application\Model\Bookable;
use Application\Model\Booking;
use Application\Model\Country;
use Application\Model\License;
use Application\Model\User;
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
        $this->addRole(User::ROLE_ANONYMOUS);
        $this->addRole(User::ROLE_MEMBER, User::ROLE_ANONYMOUS);
        $this->addRole(User::ROLE_ADMINISTRATOR);

        $this->addResource(new ModelResource(License::class));
        $this->addResource(new ModelResource(User::class));
        $this->addResource(new ModelResource(Country::class));
        $this->addResource(new ModelResource(Booking::class));
        $this->addResource(new ModelResource(Bookable::class));

        $this->allow(User::ROLE_ANONYMOUS, new ModelResource(License::class), 'read');
        $this->allow(User::ROLE_ANONYMOUS, new ModelResource(Country::class), 'read');

        $this->allow(User::ROLE_MEMBER, new ModelResource(License::class), 'create');
        $this->allow(User::ROLE_MEMBER, new ModelResource(User::class), 'read');
        $this->allow(User::ROLE_MEMBER, new ModelResource(User::class), ['update', 'delete'], new IsMyself());

        // Administrator inherits nothing, but is allowed all privileges
        $this->allow(User::ROLE_ADMINISTRATOR);
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
