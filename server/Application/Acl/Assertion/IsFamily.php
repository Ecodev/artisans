<?php

declare(strict_types=1);

namespace Application\Acl\Assertion;

use Application\Model\AbstractModel;
use Application\Model\User;
use Zend\Permissions\Acl\Acl;
use Zend\Permissions\Acl\Assertion\AssertionInterface;
use Zend\Permissions\Acl\Resource\ResourceInterface;
use Zend\Permissions\Acl\Role\RoleInterface;

class IsFamily implements AssertionInterface
{
    /**
     * Assert that the object belongs to someone in the current user family
     *
     * @param Acl $acl
     * @param RoleInterface $role
     * @param ResourceInterface $resource
     * @param string $privilege
     *
     * @return bool
     */
    public function assert(Acl $acl, RoleInterface $role = null, ResourceInterface $resource = null, $privilege = null)
    {
        /** @var AbstractModel $object */
        $object = $resource->getInstance();

        $currentFamilyOwner = User::getCurrent();
        if ($currentFamilyOwner && $currentFamilyOwner->getOwner()) {
            $currentFamilyOwner = $currentFamilyOwner->getOwner();
        }

        $objectFamilyOwner = $object->getOwner();
        if ($objectFamilyOwner && $objectFamilyOwner->getOwner()) {
            $objectFamilyOwner = $objectFamilyOwner->getOwner();
        }

        return $currentFamilyOwner && $currentFamilyOwner === $objectFamilyOwner;
    }
}
