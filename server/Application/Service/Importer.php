<?php

declare(strict_types=1);

namespace Application\Service;

use Application\DBAL\Types\MembershipType;
use Application\DBAL\Types\ProductTypeType;
use Application\Model\Organization;
use Application\Model\User;
use Application\Repository\OrganizationRepository;
use Doctrine\DBAL\Connection;
use Ecodev\Felix\Api\Exception;
use Laminas\Validator\EmailAddress;
use Throwable;

/**
 * Service to import users from CSV with maximal performance.
 *
 * Users are never deleted, even though technically they should be, to limit the loss of
 * data in case of human error in the incoming files. Because it could mean losing all historic
 * of purchases.
 *
 * On the other hand, organizations are **always** deleted, because they don't have any related objects,
 * and they are not editable (not even visible) in any way in the app.
 */
class Importer
{
    private int $lineNumber = 0;

    private array $reviewByNumber = [];

    private array $countryByName = [];

    private Connection $connection;

    private int $updatedUsers = 0;

    private int $updatedOrganizations = 0;

    private int $deletedOrganizations = 0;

    private array $seenEmails = [];

    private array $seenPatterns = [];

    private ?int $currentUser;

    public function import(string $filename): array
    {
        $start = microtime(true);
        $this->connection = _em()->getConnection();
        $this->fetchReviews();
        $this->fetchCountries();
        $this->currentUser = User::getCurrent() ? User::getCurrent()->getId() : null;
        $this->updatedUsers = 0;
        $this->updatedOrganizations = 0;
        $this->deletedOrganizations = 0;
        $this->seenEmails = [];
        $this->seenPatterns = [];

        if (!file_exists($filename)) {
            throw new Exception('File not found: ' . $filename);
        }

        $file = fopen($filename, 'rb');
        if ($file === false) {
            throw new Exception('Could not read file: ' . $filename);
        }

        $this->skipBOM($file);

        try {
            $this->connection->beginTransaction();
            $this->markToDelete();
            $this->read($file);
            $this->deleteOldOrganizations();

            // Give user automatic access via organization
            /** @var OrganizationRepository $organizationRepository */
            $organizationRepository = _em()->getRepository(Organization::class);
            $organizationRepository->applyOrganizationAccesses();

            $this->connection->commit();
        } catch (Throwable $exception) {
            $this->connection->rollBack();

            throw $exception;
        } finally {
            fclose($file);
        }

        $totalUsers = (int) $this->connection->fetchColumn('SELECT COUNT(*) FROM user');
        $totalOrganizations = (int) $this->connection->fetchColumn('SELECT COUNT(*) FROM organization');

        $time = round(microtime(true) - $start, 1);

        return [
            'updatedUsers' => $this->updatedUsers,
            'updatedOrganizations' => $this->updatedOrganizations,
            'deletedOrganizations' => $this->deletedOrganizations,
            'totalUsers' => $totalUsers,
            'totalOrganizations' => $totalOrganizations,
            'totalLines' => $this->lineNumber,
            'time' => $time,
        ];
    }

    private function fetchReviews(): void
    {
        $records = $this->connection->fetchAll('SELECT id, review_number FROM product WHERE review_number IS NOT NULL');

        $this->reviewByNumber = [];
        foreach ($records as $r) {
            $this->reviewByNumber[$r['review_number']] = $r['id'];
        }
    }

    private function fetchCountries(): void
    {
        $records = $this->connection->fetchAll('SELECT id, name, UPPER(name) AS upper FROM country');

        $this->countryByName = [];
        foreach ($records as $r) {
            $this->countryByName[$r['upper']] = $r;
        }
    }

    /**
     * @param resource $file
     */
    private function skipBOM($file): void
    {
        // Consume BOM, but if not BOM, rewind to beginning
        if (fgets($file, 4) !== "\xEF\xBB\xBF") {
            rewind($file);
        }
    }

    /**
     * @param resource $file
     */
    private function read($file): void
    {
        $this->lineNumber = 0;
        $expectedColumnCount = 14;
        while ($line = fgetcsv($file, 0, "\t")) {
            ++$this->lineNumber;

            $actualColumnCount = count($line);
            if ($actualColumnCount !== $expectedColumnCount) {
                $this->throw("Doit avoir exactement $expectedColumnCount colonnes, mais en a " . $actualColumnCount);
            }

            // un-escape all fields
            $line = array_map(fn ($r) => html_entity_decode($r), $line);

            [
                $email,
                $pattern,
                $subscriptionType,
                $lastReviewNumber,
                $ignored,
                $firstName,
                $lastName,
                $street,
                $street2,
                $postcode,
                $locality,
                $country,
                $phone,
                $membership
            ] = $line;

            if (!$email && !$pattern) {
                $this->throw('Il faut soit un email, soit un pattern, mais aucun existe');
            }

            $lastReviewId = $this->readReviewId($lastReviewNumber);

            if ($email) {
                $this->assertEmail($email);
                $membership = $this->readMembership($membership);
                $country = $this->readCountryId($country);
                $subscriptionType = $this->readSubscriptionType($subscriptionType);

                $this->updateUser(
                    $email,
                    $subscriptionType,
                    $lastReviewId,
                    $membership,
                    $firstName,
                    $lastName,
                    trim(implode(' ', [$street, $street2])),
                    $postcode,
                    $locality,
                    $country,
                    $phone
                );
            }

            if ($pattern) {
                $this->assertPattern($pattern);

                $this->updateOrganization(
                    $pattern,
                    $lastReviewId
                );
            }
        }
    }

    private function assertEmail(string $email): void
    {
        $validator = new EmailAddress();
        if (!$validator->isValid($email)) {
            $this->throw("Ce n'est pas une addresse email valide : " . $email);
        }

        if (array_key_exists($email, $this->seenEmails)) {
            $this->throw('L\'email "' . $email . '" est dupliqué et a déjà été vu à la ligne ' . $this->seenEmails[$email]);
        }

        $this->seenEmails[$email] = $this->lineNumber;
    }

    private function assertPattern(string $pattern): void
    {
        if (@preg_match('~' . $pattern . '~', '') === false) {
            $this->throw("Ce n'est pas une expression régulière valide : " . $pattern);
        }

        if (array_key_exists($pattern, $this->seenPatterns)) {
            $this->throw('Le pattern "' . $pattern . '" est dupliqué et a déjà été vu à la ligne ' . $this->seenPatterns[$pattern]);
        }

        $this->seenPatterns[$pattern] = $this->lineNumber;
    }

    private function readReviewId(string $reviewNumber): ?string
    {
        if (!$reviewNumber) {
            return null;
        }

        if ($reviewNumber && !preg_match('~^\d+$~', $reviewNumber)) {
            $this->throw('Un numéro de revue doit être entièrement numérique, mais est : ' . $reviewNumber);
        }

        $reviewNumberNumeric = (int) $reviewNumber;
        if (!array_key_exists($reviewNumberNumeric, $this->reviewByNumber)) {
            $this->throw('Revue introuvable pour le numéro de revue : ' . $reviewNumber);
        }

        return $this->reviewByNumber[$reviewNumberNumeric];
    }

    private function readCountryId(string $country): ?string
    {
        if (!$country) {
            return null;
        }

        // Case insensitive match
        $upper = trim(mb_strtoupper($country));
        if (array_key_exists($upper, $this->countryByName)) {
            return $this->countryByName[$upper]['id'];
        }

        // Suggest our best guess, so user can fix their data without lookup up countries manually
        $best = 0;
        $bestGuess = 0;
        foreach ($this->countryByName as $r) {
            similar_text($upper, $r['upper'], $percent);
            if ($percent > $best) {
                $best = $percent;
                $bestGuess = $r;
            }
        }

        $this->throw('Pays "' . $country . '" introuvable. Vouliez-vous dire "' . $bestGuess['name'] . '" ?');
    }

    private function throw(string $message): void
    {
        throw new Exception('A la ligne ' . $this->lineNumber . ' : ' . $message);
    }

    private function deleteOldOrganizations(): void
    {
        $sql = 'DELETE FROM organization WHERE should_delete';
        $this->deletedOrganizations += $this->connection->executeUpdate($sql);
    }

    private function readMembership($membership): string
    {
        if ($membership === '1') {
            return MembershipType::MEMBER;
        }

        return MembershipType::NONE;
    }

    private function readSubscriptionType(string $subscriptionType): ?string
    {
        if (!$subscriptionType) {
            return null;
        }

        if ($subscriptionType === 'Web') {
            return ProductTypeType::DIGITAL;
        }

        if ($subscriptionType === 'Papier') {
            return ProductTypeType::PAPER;
        }

        if ($subscriptionType === 'Papier/web') {
            return ProductTypeType::BOTH;
        }

        $this->throw('Le subscriptionType est invalide : ' . $subscriptionType);
    }

    private function updateUser(...$args): void
    {
        $sql = 'INSERT INTO user (
                            email,
                            subscription_type,
                            subscription_last_review_id,
                            membership,
                            first_name,
                            last_name,
                            street,
                            postcode,
                            locality,
                            country_id,
                            phone,
                            web_temporary_access,
                            should_delete,
                            password,
                            creator_id,
                            creation_date
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                        ON DUPLICATE KEY UPDATE
                            email = VALUES(email),
                            subscription_type = VALUES(subscription_type),
                            subscription_last_review_id = VALUES(subscription_last_review_id),
                            membership = VALUES(membership),
                            first_name = VALUES(first_name),
                            last_name = VALUES(last_name),
                            street = VALUES(street),
                            postcode = VALUES(postcode),
                            locality = VALUES(locality),
                            country_id = VALUES(country_id),
                            phone = VALUES(phone),
                            web_temporary_access = VALUES(web_temporary_access),
                            should_delete = VALUES(should_delete),
                            updater_id = VALUES(creator_id),
                            update_date = NOW()';

        $params = $args;
        $params[] = false; // web_temporary_access
        $params[] = false; // should_delete
        $params[] = ''; // password
        $params[] = $this->currentUser;

        $changed = $this->connection->executeUpdate($sql, $params);

        if ($changed) {
            ++$this->updatedUsers;
        }
    }

    private function updateOrganization(...$args): void
    {
        $sql = 'INSERT INTO organization (pattern, subscription_last_review_id, creator_id, creation_date)
                        VALUES (?, ?, ?, NOW())
                        ON DUPLICATE KEY UPDATE
                        pattern = VALUES(pattern),
                        subscription_last_review_id = VALUES(subscription_last_review_id),
                        updater_id = VALUES(creator_id),
                        update_date = NOW()';

        $params = $args;
        $params[] = $this->currentUser;

        $changed = $this->connection->executeUpdate($sql, $params);

        if ($changed) {
            ++$this->updatedOrganizations;
        }
    }

    private function markToDelete(): void
    {
        $this->connection->executeUpdate('UPDATE user SET should_delete = 1');
        $this->connection->executeUpdate('UPDATE organization SET should_delete = 1');
    }
}
