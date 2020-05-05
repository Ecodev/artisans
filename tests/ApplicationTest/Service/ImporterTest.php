<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\Service\Importer;
use ApplicationTest\Traits\TestWithTransaction;
use PHPUnit\Framework\TestCase;

class ImporterTest extends TestCase
{
    use TestWithTransaction;

    public function testInvalidEmail(): void
    {
        $this->expectErrorMessage("A la ligne 1: L'email suivant n'est ni une addresse email valide, ni un expression régulière valide: fo[o");
        $this->import('tests/data/importer/invalid-email.csv');
    }

    public function testInvalidDate(): void
    {
        $this->expectErrorMessage('A la ligne 1: La date devrait avoir le format YYYY-MM-DD, mais est: 24.12.2020');
        $this->import('tests/data/importer/invalid-date.csv');
    }

    public function testInvalidEmptyEmail(): void
    {
        $this->expectErrorMessage("A la ligne 1: L'email ne peut pas être vide");
        $this->import('tests/data/importer/invalid-empty-email.csv');
    }

    public function testInvalidDuplicatedEmail(): void
    {
        $this->expectErrorMessage("A la ligne 3: L'email \"foo@example.com\" est dupliqué et a déjà été vu à la ligne 1");
        $this->import('tests/data/importer/invalid-duplicated-email.csv');
    }

    public function testInvalidReviewNumber(): void
    {
        $this->expectErrorMessage('A la ligne 1: Un numéro de revue doit être entièrement numérique, mais est: foo');
        $this->import('tests/data/importer/invalid-review-number.csv');
    }

    public function testInvalidMissingReviewNumber(): void
    {
        $this->expectErrorMessage('A la ligne 1: Revue introuvable pour le numéro de revue: 123');
        $this->import('tests/data/importer/invalid-missing-review-number.csv');
    }

    public function testImport(): void
    {
        $this->assertUser([
            'email' => 'member@example.com',
            'first_name' => 'Hector',
            'subscription_last_review_id' => null,
            'membership_begin' => null,
            'membership_end' => null,
            'web_temporary_access' => '0',
        ]);

        $otherMember = [
            'email' => 'othermember@example.com',
            'first_name' => 'Elizabeth',
            'subscription_last_review_id' => '3001',
            'membership_begin' => '2020-01-02 00:00:00',
            'membership_end' => null,
            'web_temporary_access' => '0',
        ];
        $this->assertUser($otherMember);

        $actual = $this->import('tests/data/importer/normal.csv');
        $expected = [
            'updatedUsers' => 4,
            'updatedOrganizations' => 1,
            'deletedOrganizations' => 2,
            'totalUsers' => 6,
            'totalOrganizations' => 1,
            'totalLines' => 5,
        ];
        self::assertSame($expected, $actual);

        $this->assertUser([
            'email' => 'new@example.com',
            'first_name' => '',
            'subscription_last_review_id' => null,
            'membership_begin' => null,
            'membership_end' => null,
            'web_temporary_access' => '0',
        ]);

        $this->assertUser([
            'email' => 'new.with.everything@example.com',
            'first_name' => '',
            'subscription_last_review_id' => '3000',
            'membership_begin' => '2010-12-24 00:00:00',
            'membership_end' => '2019-01-01 00:00:00',
            'web_temporary_access' => '0',
        ]);

        $this->assertUser([
            'email' => 'member@example.com',
            'first_name' => 'Hector', // This must remains untouched
            'subscription_last_review_id' => null,
            'membership_begin' => '2020-01-01 00:00:00',
            'membership_end' => null,
            'web_temporary_access' => '0',
        ]);

        $this->assertOrganization([
            'pattern' => '.*@university.com',
            'subscription_last_review_id' => '3001',
        ]);

        // Unchanged
        $this->assertUser($otherMember);
    }

    private function assertUser(array $expected): void
    {
        $connection = $this->getEntityManager()->getConnection();
        $actual = $connection->fetchAssoc('SELECT email, first_name, subscription_last_review_id, membership_begin, membership_end, web_temporary_access FROM user WHERE email = ?', [$expected['email']]);
        self::assertSame($expected, $actual);
    }

    private function assertOrganization(array $expected): void
    {
        $connection = $this->getEntityManager()->getConnection();
        $actual = $connection->fetchAssoc('SELECT pattern, subscription_last_review_id FROM organization WHERE pattern = ?', [$expected['pattern']]);
        self::assertSame($expected, $actual);
    }

    private function import(string $filename): array
    {
        $importer = new Importer();
        $actual = $importer->import($filename);

        return $actual;
    }
}
