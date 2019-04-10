<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\Model\User;
use Application\Service\Invoicer;
use ApplicationTest\Traits\TestWithTransaction;
use PHPUnit\Framework\TestCase;

class InvoicerTest extends TestCase
{
    use TestWithTransaction;

    public function testInvoice(): void
    {
        global $container;

        $user = _em()->getRepository(User::class)->getOneByLogin('administrator');
        User::setCurrent($user);

        /** @var Invoicer $invoicer */
        $invoicer = $container->get(Invoicer::class);
        $actual = $invoicer->invoice();
        self::assertSame(2, $actual);

        $actual2 = $invoicer->invoice();
        self::assertSame(0, $actual2);
    }
}
