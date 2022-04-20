<?php

declare(strict_types=1);

namespace Application\Acl;

use Application\Model\Comment;
use Application\Model\Configuration;
use Application\Model\Country;
use Application\Model\Event;
use Application\Model\File;
use Application\Model\Image;
use Application\Model\Message;
use Application\Model\News;
use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\Organization;
use Application\Model\Product;
use Application\Model\ProductTag;
use Application\Model\Session;
use Application\Model\Subscription;
use Application\Model\User;
use Ecodev\Felix\Acl\Assertion\IsMyself;

class Acl extends \Ecodev\Felix\Acl\Acl
{
    public function __construct()
    {
        parent::__construct();

        // Each role is strictly "stronger" than the last one
        $this->addRole(User::ROLE_ANONYMOUS);
        $this->addRole(User::ROLE_MEMBER, User::ROLE_ANONYMOUS);
        $this->addRole(User::ROLE_FACILITATOR, User::ROLE_MEMBER);
        $this->addRole(User::ROLE_ADMINISTRATOR, User::ROLE_FACILITATOR);

        $comment = $this->createModelResource(Comment::class);
        $configuration = $this->createModelResource(Configuration::class);
        $country = $this->createModelResource(Country::class);
        $event = $this->createModelResource(Event::class);
        $file = $this->createModelResource(File::class);
        $image = $this->createModelResource(Image::class);
        $message = $this->createModelResource(Message::class);
        $news = $this->createModelResource(News::class);
        $order = $this->createModelResource(Order::class);
        $orderLine = $this->createModelResource(OrderLine::class);
        $organization = $this->createModelResource(Organization::class);
        $product = $this->createModelResource(Product::class);
        $productTag = $this->createModelResource(ProductTag::class);
        $session = $this->createModelResource(Session::class);
        $subscription = $this->createModelResource(Subscription::class);
        $user = $this->createModelResource(User::class);

        $this->allow(User::ROLE_ANONYMOUS, [$configuration, $event, $news, $session, $product, $subscription, $productTag, $image, $country, $comment], ['read']);

        $this->allow(User::ROLE_MEMBER, [$user], ['read']);
        $this->allow(User::ROLE_MEMBER, [$user], ['update'], new IsMyself());
        $this->allow(User::ROLE_MEMBER, [$file], ['read']);
        $this->allow(User::ROLE_MEMBER, [$message], ['read']);
        $this->allow(User::ROLE_MEMBER, [$order, $orderLine], ['read']);
        $this->allow(User::ROLE_MEMBER, [$order], ['create']);
        $this->allow(User::ROLE_MEMBER, [$comment], ['create']); // if grant update, care to GUI button that sends to admin

        $this->allow(User::ROLE_FACILITATOR, [$file], ['read', 'update']);
        $this->allow(User::ROLE_FACILITATOR, [$user], ['update']);

        $this->allow(User::ROLE_ADMINISTRATOR, [$file, $event, $news, $session, $subscription, $product, $productTag, $country, $image, $comment], ['create', 'update', 'delete']);
        $this->allow(User::ROLE_ADMINISTRATOR, [$orderLine], ['update']);
        $this->allow(User::ROLE_ADMINISTRATOR, [$configuration, $organization], ['create']);
        $this->allow(User::ROLE_ADMINISTRATOR, [$user], ['create', 'delete']);
    }
}
