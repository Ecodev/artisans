<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\Service\Importer;
use ApplicationTest\Traits\TestWithTransactionAndUser;
use PHPUnit\Framework\TestCase;

class ImporterTest extends TestCase
{
    use TestWithTransactionAndUser;

    public function testInvalidFilename(): void
    {
        $this->expectErrorMessage('File not found: non-existing-filename.csv');
        $this->import('non-existing-filename.csv');
    }

    public function testInvalidEmail(): void
    {
        $this->expectErrorMessage('A la ligne 1 : Ce n\'est pas une addresse email valide : "fo[o"');
        $this->import('tests/data/importer/invalid-email.csv');
    }

    public function testInvalidPattern(): void
    {
        $this->expectErrorMessage('A la ligne 1 : Ce n\'est pas une expression régulière valide : "fo[o"');
        $this->import('tests/data/importer/invalid-pattern.csv');
    }

    public function testInvalidEmpty(): void
    {
        $this->expectErrorMessage('A la ligne 1 : Il faut soit un email, soit un pattern, mais aucun existe');
        $this->import('tests/data/importer/invalid-empty.csv');
    }

    public function testInvalidDuplicatedEmail(): void
    {
        $this->expectErrorMessage("A la ligne 3 : L'email \"foo@example.com\" est dupliqué et a déjà été vu à la ligne 1");
        $this->import('tests/data/importer/invalid-duplicated-email.csv');
    }

    public function testInvalidDuplicatedPattern(): void
    {
        $this->expectErrorMessage('A la ligne 2 : Le pattern ".*@university\.com" est dupliqué et a déjà été vu à la ligne 1');
        $this->import('tests/data/importer/invalid-duplicated-pattern.csv');
    }

    public function testInvalidReviewNumber(): void
    {
        $this->expectErrorMessage('A la ligne 1 : Un numéro de revue doit être entièrement numérique, mais est : "foo"');
        $this->import('tests/data/importer/invalid-review-number.csv');
    }

    public function testInvalidMissingReviewNumber(): void
    {
        $this->expectErrorMessage('A la ligne 1 : Revue introuvable pour le numéro de revue : 123');
        $this->import('tests/data/importer/invalid-missing-review-number.csv');
    }

    public function testInvalidColumnCount(): void
    {
        $this->expectErrorMessage('A la ligne 1 : Doit avoir exactement 14 colonnes, mais en a 5');
        $this->import('tests/data/importer/invalid-column-count.csv');
    }

    public function testInvalidSubscriptionType(): void
    {
        $this->expectErrorMessage('A la ligne 1 : Le subscriptionType est invalide : "foo"');
        $this->import('tests/data/importer/invalid-subscription-type.csv');
    }

    public function testInvalidMultipleErrors(): void
    {
        $this->expectErrorMessage('A la ligne 1 : Pays "suise" introuvable. Vouliez-vous dire "SUISSE" ?
A la ligne 2 : Revue introuvable pour le numéro de revue : 123');
        $this->import('tests/data/importer/invalid-multiple-errors.csv');
    }

    public function testFuzzyCountry(): void
    {
        $this->expectErrorMessage('A la ligne 1 : Pays "suise" introuvable. Vouliez-vous dire "SUISSE" ?');

        $this->import('tests/data/importer/invalid-country.csv');
    }

    public function testCountryWithAccent(): void
    {
        $this->import('tests/data/importer/valid-country.csv');

        $this->assertUser([
            'email' => 'b@example.com',
            'subscription_type' => null,
            'subscription_last_review_id' => null,
            'membership' => 'none',
            'first_name' => '',
            'last_name' => '',
            'street' => '',
            'postcode' => '',
            'locality' => '',
            'country_id' => '51',
            'phone' => '',
            'web_temporary_access' => '0',
            'password' => '',
        ]);

        $this->assertUser([
            'email' => 'c@example.com',
            'subscription_type' => null,
            'subscription_last_review_id' => null,
            'membership' => 'none',
            'first_name' => '',
            'last_name' => '',
            'street' => '',
            'postcode' => '',
            'locality' => '',
            'country_id' => '51',
            'phone' => '',
            'web_temporary_access' => '0',
            'password' => '',
        ]);

        $this->assertUser([
            'email' => 'd@example.com',
            'subscription_type' => null,
            'subscription_last_review_id' => null,
            'membership' => 'none',
            'first_name' => '',
            'last_name' => '',
            'street' => '',
            'postcode' => '',
            'locality' => '',
            'country_id' => '29',
            'phone' => '',
            'web_temporary_access' => '0',
            'password' => '',
        ]);
    }

    public function testImport(): void
    {
        $this->assertUser([
            'email' => 'member@example.com',
            'subscription_type' => null,
            'subscription_last_review_id' => null,
            'membership' => 'none',
            'first_name' => 'Hector',
            'last_name' => 'Barbossa',
            'street' => '',
            'postcode' => '',
            'locality' => '',
            'country_id' => '1',
            'phone' => '',
            'web_temporary_access' => '0',
            'password' => 'aa08769cdcb26674c6706093503ff0a3',
        ]);

        $otherMember = [
            'email' => 'othermember@example.com',
            'subscription_type' => 'digital',
            'subscription_last_review_id' => '3001',
            'membership' => 'member',
            'first_name' => 'Elizabeth',
            'last_name' => 'Swann',
            'street' => '',
            'postcode' => '',
            'locality' => '',
            'country_id' => '1',
            'phone' => '',
            'web_temporary_access' => '0',
            'password' => '1895eaf4aad48bd97ec1a2fd15336591',
        ];
        $this->assertUser($otherMember);

        $this->assertShouldDeleteUserCount(0);
        $actual = $this->import('tests/data/importer/normal.csv');

        self::assertArrayHasKey('time', $actual);
        unset($actual['time']);

        $expected = [
            'updatedUsers' => 4,
            'updatedOrganizations' => 1,
            'deletedOrganizations' => 2,
            'totalUsers' => 6,
            'totalOrganizations' => 1,
            'totalLines' => 5,
        ];
        self::assertSame($expected, $actual);

        $this->assertShouldDeleteUserCount(2);

        $this->assertUser([
            'email' => 'new@example.com',
            'subscription_type' => null,
            'subscription_last_review_id' => null,
            'membership' => 'none',
            'first_name' => '',
            'last_name' => '',
            'street' => '',
            'postcode' => '',
            'locality' => '',
            'country_id' => null,
            'phone' => '',
            'web_temporary_access' => '0',
            'password' => '',
        ]);

        $this->assertUser([
            'email' => 'théo@example.com',
            'subscription_type' => 'paper',
            'subscription_last_review_id' => null,
            'membership' => 'member',
            'first_name' => '',
            'last_name' => '',
            'street' => '',
            'postcode' => '',
            'locality' => '',
            'country_id' => null,
            'phone' => '',
            'web_temporary_access' => '0',
            'password' => '',
        ]);

        $this->assertUser([
            'email' => 'member@example.com',
            'subscription_type' => 'both',
            'subscription_last_review_id' => null,
            'membership' => 'member',
            'first_name' => 'Roger "Bob"',
            'last_name' => 'Doe',
            'street' => 'Main street',
            'postcode' => '2000',
            'locality' => 'New York',
            'country_id' => '2',
            'phone' => '032 987 65 43',
            'web_temporary_access' => '0',
            'password' => 'aa08769cdcb26674c6706093503ff0a3',
        ]);

        $this->assertOrganization([
            'pattern' => '.*@university\.com',
            'subscription_last_review_id' => '3001',
        ]);

        // Unchanged
        $this->assertUser($otherMember);
    }

    public function testImportBothInOneLine(): void
    {
        $this->assertShouldDeleteUserCount(0);
        $actual = $this->import('tests/data/importer/both-in-one-line.csv');

        self::assertArrayHasKey('time', $actual);
        unset($actual['time']);

        $expected = [
            'updatedUsers' => 1,
            'updatedOrganizations' => 1,
            'deletedOrganizations' => 2,
            'totalUsers' => 5,
            'totalOrganizations' => 1,
            'totalLines' => 1,
        ];
        self::assertSame($expected, $actual);

        $this->assertShouldDeleteUserCount(4);

        $this->assertUser([
            'email' => 'new@example.com',
            'subscription_type' => 'digital',
            'subscription_last_review_id' => '3001',
            'membership' => 'none',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'street' => 'Main street',
            'postcode' => '8000',
            'locality' => 'Zurich',
            'country_id' => '1',
            'phone' => '837 28 73',
            'web_temporary_access' => '0',
            'password' => '',
        ]);

        $this->assertOrganization([
            'pattern' => '.*@university\.com',
            'subscription_last_review_id' => '3001',
        ]);
    }

    public function testBomIsSkipped(): void
    {
        $this->import('tests/data/importer/bom.csv');

        $this->assertUser([
            'email' => 'bom@example.com',
            'subscription_type' => null,
            'subscription_last_review_id' => null,
            'membership' => 'none',
            'first_name' => '',
            'last_name' => '',
            'street' => '',
            'postcode' => '',
            'locality' => '',
            'country_id' => null,
            'phone' => '',
            'web_temporary_access' => '0',
            'password' => '',
        ]);
    }

    public function testEscapedSequences(): void
    {
        $this->import('tests/data/importer/escaped.csv');

        $this->assertUser([
            'email' => 'escaped@example.com',
            'subscription_type' => null,
            'subscription_last_review_id' => null,
            'membership' => 'none',
            'first_name' => 'test"test\'test\test',
            'last_name' => 'test"test\'test\test',
            'street' => '',
            'postcode' => '',
            'locality' => '',
            'country_id' => null,
            'phone' => '',
            'web_temporary_access' => '0',
            'password' => '',
        ]);
    }

    private function assertShouldDeleteUserCount(int $expected): void
    {
        $connection = $this->getEntityManager()->getConnection();
        $actual = (int) $connection->fetchColumn('SELECT COUNT(*) FROM user WHERE should_delete');

        self::assertSame($expected, $actual);
    }

    private function assertUser(array $expected): void
    {
        $connection = $this->getEntityManager()->getConnection();
        $actual = $connection->fetchAssoc('SELECT email, subscription_type, subscription_last_review_id, membership, first_name, last_name, street, postcode, locality, country_id, phone, web_temporary_access, password FROM user WHERE email = ?', [$expected['email']]);

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
