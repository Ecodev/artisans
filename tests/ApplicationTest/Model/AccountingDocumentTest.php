<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\AccountingDocument;
use Application\Model\User;
use PHPUnit\Framework\TestCase;

class AccountingDocumentTest extends TestCase
{
    public function tearDown(): void
    {
        User::setCurrent(null);
    }

    public function testGetPath(): void
    {
        $document = new AccountingDocument();
        $document->setFilename('invoice.pdf');

        self::assertSame('invoice.pdf', $document->getFilename());
        $appPath = realpath('.');
        $expected = $appPath . '/data/accounting/invoice.pdf';
        self::assertSame($expected, $document->getPath());
    }

    public function testGetPermissions(): void
    {
        $document = new AccountingDocument();
        $actual = $document->getPermissions();
        $expected = [
            'create' => false,
            'read' => false,
            'update' => false,
            'delete' => false,
        ];
        self::assertEquals($expected, $actual, 'should be able to get permissions as anonymous');

        // Make it the current user as creator
        $user = new User();
        User::setCurrent($user);
        $document->timestampCreation();

        $actual2 = $document->getPermissions();
        $expected2 = [
            'create' => true,
            'read' => true,
            'update' => true,
            'delete' => true,
        ];
        self::assertEquals($expected2, $actual2, 'should be able to get permissions as creator');
    }
}
