<?php

declare(strict_types=1);

namespace Application\Acl;

use Application\Acl\Assertion\All;
use Application\Acl\Assertion\ExpenseClaimStatusIsNew;
use Application\Acl\Assertion\IsMyself;
use Application\Acl\Assertion\IsOwner;
use Application\Acl\Assertion\IsRecipient;
use Application\Acl\Assertion\StatusIsNew;
use Application\Model\AbstractModel;
use Application\Model\Account;
use Application\Model\AccountingDocument;
use Application\Model\Bookable;
use Application\Model\BookableMetadata;
use Application\Model\BookableTag;
use Application\Model\Booking;
use Application\Model\Category;
use Application\Model\Country;
use Application\Model\ExpenseClaim;
use Application\Model\Image;
use Application\Model\License;
use Application\Model\Message;
use Application\Model\Transaction;
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
        $this->addRole(User::ROLE_BOOKING_ONLY, User::ROLE_ANONYMOUS);
        $this->addRole(User::ROLE_INDIVIDUAL, User::ROLE_BOOKING_ONLY);
        $this->addRole(User::ROLE_MEMBER, User::ROLE_INDIVIDUAL);
        $this->addRole(User::ROLE_RESPONSIBLE, User::ROLE_MEMBER);
        $this->addRole(User::ROLE_ADMINISTRATOR, User::ROLE_RESPONSIBLE);

        $bookable = new ModelResource(Bookable::class);
        $bookableMetadata = new ModelResource(BookableMetadata::class);
        $bookableTag = new ModelResource(BookableTag::class);
        $booking = new ModelResource(Booking::class);
        $image = new ModelResource(Image::class);
        $license = new ModelResource(License::class);
        $user = new ModelResource(User::class);
        $userTag = new ModelResource(UserTag::class);
        $country = new ModelResource(Country::class);
        $account = new ModelResource(Account::class);
        $accountingDocument = new ModelResource(AccountingDocument::class);
        $category = new ModelResource(Category::class);
        $expenseClaim = new ModelResource(ExpenseClaim::class);
        $message = new ModelResource(Message::class);
        $transaction = new ModelResource(Transaction::class);

        $this->addResource($bookable);
        $this->addResource($bookableMetadata);
        $this->addResource($bookableTag);
        $this->addResource($booking);
        $this->addResource($image);
        $this->addResource($license);
        $this->addResource($user);
        $this->addResource($userTag);
        $this->addResource($country);
        $this->addResource($account);
        $this->addResource($accountingDocument);
        $this->addResource($category);
        $this->addResource($expenseClaim);
        $this->addResource($message);
        $this->addResource($transaction);

        $this->allow(User::ROLE_ANONYMOUS, [$country, $bookable, $bookableMetadata, $bookableTag, $image, $license, $category], ['read']);
        $this->allow(User::ROLE_ANONYMOUS, $user, ['create']);

        $this->allow(User::ROLE_BOOKING_ONLY, $booking, ['create', 'read', 'update']);

        $this->allow(User::ROLE_INDIVIDUAL, $user, ['read']);
        $this->allow(User::ROLE_INDIVIDUAL, $user, ['update'], new IsMyself());
        $this->allow(User::ROLE_INDIVIDUAL, [$account, $expenseClaim], ['create']);
        $this->allow(User::ROLE_INDIVIDUAL, [$expenseClaim], ['read'], new IsOwner());
        $this->allow(User::ROLE_INDIVIDUAL, [$expenseClaim], ['update', 'delete'], new All(new IsOwner(), new StatusIsNew()));
        $this->allow(User::ROLE_INDIVIDUAL, [$accountingDocument], ['create'], new ExpenseClaimStatusIsNew());
        $this->allow(User::ROLE_INDIVIDUAL, [$accountingDocument], ['read'], new IsOwner());
        $this->allow(User::ROLE_INDIVIDUAL, [$accountingDocument], ['update', 'delete'], new All(new IsOwner(), new ExpenseClaimStatusIsNew()));
        $this->allow(User::ROLE_INDIVIDUAL, [$account], ['read', 'update'], new IsOwner());
        $this->allow(User::ROLE_INDIVIDUAL, $message, ['read'], new IsRecipient());

        $this->allow(User::ROLE_MEMBER, $user, ['update'], new IsOwner());

        $this->allow(User::ROLE_RESPONSIBLE, [$transaction, $account, $category], ['read']);
        $this->allow(User::ROLE_RESPONSIBLE, [$expenseClaim, $accountingDocument], ['read', 'update']);
        $this->allow(User::ROLE_RESPONSIBLE, [$user], ['update']);
        $this->allow(User::ROLE_RESPONSIBLE, [$userTag], ['create', 'read', 'update', 'delete']);
        $this->allow(User::ROLE_RESPONSIBLE, [$bookable, $bookableMetadata, $bookableTag, $image, $license], ['create', 'update', 'delete']);

        $this->allow(User::ROLE_ADMINISTRATOR, [$transaction, $account, $category], ['create', 'update', 'delete']);
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

        $user = User::getCurrent() ? 'User "' . User::getCurrent()->getLogin() . '"' : 'Non-logged user';
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
