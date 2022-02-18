<?php

declare(strict_types=1);

use Application\DBAL\Types\MessageTypeType;
use Doctrine\DBAL\Connection;
use PHPUnit\Framework\Assert;

return [
    [
        'query' => 'mutation {
            requestPasswordReset(email: "member@example.com")
        }',
    ],
    [
        'data' => [
            'requestPasswordReset' => true,
        ],
    ],
    function (Connection $connection): void {
        $connection->executeStatement(
            'UPDATE user SET password = "" WHERE email = :email',
            ['email' => 'member@example.com']
        );
    },
    function (Connection $connection): void {
        $count = $connection->executeQuery(
            'SELECT COUNT(*) FROM message WHERE type = :type AND email = :email',
            ['type' => MessageTypeType::REGISTER, 'email' => 'member@example.com']
        )->fetchOne();

        Assert::assertSame(1, $count, 'should have sent 1 email to confirm registration');
    },
];
