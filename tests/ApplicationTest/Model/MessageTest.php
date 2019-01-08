<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Message;
use Application\Model\User;
use PHPUnit\Framework\TestCase;

class MessageTest extends TestCase
{
    public function testUserRelation(): void
    {
        $message = new Message();
        $recipient = new User();
        $message->setRecipient($recipient);

        self::assertCount(1, $recipient->getMessages());

        $message2 = new Message();
        $recipient2 = new User();

        $message2->setRecipient($recipient2);
        $message->setRecipient($recipient2);

        self::assertCount(0, $recipient->getMessages());
        self::assertCount(2, $recipient2->getMessages());
    }
}
