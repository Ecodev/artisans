<?php

declare(strict_types=1);

namespace Application\Acl\Assertion;

use Application\DBAL\Types\ExpenseClaimStatusType;
use Zend\Permissions\Acl\Acl;
use Zend\Permissions\Acl\Assertion\AssertionInterface;
use Zend\Permissions\Acl\Resource\ResourceInterface;
use Zend\Permissions\Acl\Role\RoleInterface;

class StatusIsNew implements AssertionInterface
{
    /**
     * Assert that the expense claim is new (not processed yet)
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
        $object = $resource->getInstance();

        return $object->getStatus() === ExpenseClaimStatusType::NEW;
    }
}
