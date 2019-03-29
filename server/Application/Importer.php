<?php

declare(strict_types=1);

namespace Application;

use Doctrine\DBAL\Driver\PDOConnection;

class Importer
{
    /**
     * @var PDOConnection
     */
    private $filemaker;

    /**
     * @var PDOConnection
     */
    private $typo3;

    /**
     * @var array
     */
    private $members = [];

    /**
     * @var array
     */
    private $users = [];

    /**
     * Import constructor
     */
    public function __construct()
    {
        $this->loadMembers();
        $this->loadPeople();
        $this->deleteTestUsers();
        $this->insertUsers();
    }

    /**
     * @return PDOConnection
     */
    private function connectFileMaker(): PDOConnection
    {
        global $container;
        if ($this->filemaker) {
            return $this->filemaker;
        }
        $config = $container->get('config');

        $dsn = sprintf('odbc:Driver={%s};Server=%s;Database=%s;charset=UTF-8', $config['filemaker']['driver'], $config['filemaker']['host'], $config['filemaker']['dbname']);
        $this->filemaker = new PDOConnection($dsn, $config['filemaker']['user'], $config['filemaker']['password']);

        return $this->filemaker;
    }

    /**
     * @return PDOConnection
     */
    private function connectTypo3(): PDOConnection
    {
        global $container;
        if ($this->typo3) {
            return $this->typo3;
        }
        $config = $container->get('config');

        $this->typo3 = new PDOConnection(sprintf('mysql:host=%s;port=%u;dbname=%s', $config['typo3']['host'], $config['typo3']['port'], $config['typo3']['dbname']), $config['typo3']['user'], $config['typo3']['password']);

        return $this->typo3;
    }

    /**
     * Load members from FileMaker "ichtus" table into memory
     */
    private function loadMembers(): void
    {
        $this->connectFileMaker();
        $query = <<<EOT
          SELECT ID_membre,
               "nom_prénom",
               "date_entrée ichtus",
               remarques,
               "liens de famille",
               "date_séance d'accueil",
               "date_formulaire_adhésion",
               membre_new,
               membre_actif,
               membre_suspension,
               "membre_archivé",
               assurances,
               envoi_papier
          FROM ichtus
          WHERE ((membre_new>0 AND "date_formulaire_adhésion">=DATE '2018-10-01') OR membre_actif>0 OR membre_suspension>0) AND "membre_archivé"=0 AND remarques NOT LIKE '%Ignorer%'
EOT;
        $statement = $this->filemaker->prepare(trim($query));
        if ($statement->execute()) {
            echo sprintf('%u membres à importer...', $statement->rowCount()) . PHP_EOL;
            foreach ($statement->fetchAll(\PDO::FETCH_ASSOC) as $member) {
                foreach ($member as $fieldName => $fieldValue) {
                    $member[$fieldName] = $this->fromMacRoman($fieldValue);
                }
                $this->members[$member['ID_membre']] = $member;
                echo sprintf('Membre %u importé', $member['ID_membre']) . PHP_EOL;
            }
        }
    }

    /**
     * Load people from TYPO3 fe_users into memory
     */
    private function loadPeople(): void
    {
        $this->connectTypo3();
        $query = <<<EOT
          SELECT *
          FROM fe_users
          WHERE FIND_IN_SET(CAST(family_uid as char), :members) AND status_archived=0 AND disable=0;
EOT;
        $statement = $this->typo3->prepare($query);
        $statement->bindValue('members', implode(',', array_keys($this->members)));

        if ($statement->execute()) {
            echo sprintf('%u individus à importer...', $statement->rowCount()) . PHP_EOL;
            $withoutLoginCount = 0;
            foreach ($statement->fetchAll(\PDO::FETCH_ASSOC) as $user) {
                if (($user['family_status'] === 'chef de famille' || $user['family_status'] === 'chef(fe) de famille') && $user['uid'] !== $user['family_uid']) {
                    echo sprintf('WARN: utilisateur %u ne devrait pas être de chef de la famille %u', $user['uid'], $user['family_uid']) . PHP_EOL;
                }
                if (empty($user['new_username'])) {
                    echo sprintf("WARN: utilisateur %u (%s %s) n'a pas de login MyIchtus", $user['uid'], $user['first_name'], $user['last_name']) . PHP_EOL;
                    ++$withoutLoginCount;
                }
                $this->users[$user['uid']] = $user;
                echo sprintf('Individu %u importé', $user['uid']) . PHP_EOL;
            }
            if ($withoutLoginCount > 0) {
                echo sprintf('%u individus sans login MyIchtus', $withoutLoginCount) . PHP_EOL;
            }
        }
    }

    /**
     * Create users
     */
    private function insertUsers(): void
    {
        $conn = _em()->getConnection();
        foreach ($this->users as $user) {
            echo sprintf('Insert user %u (%s %s)', $user['uid'], $user['first_name'], $user['last_name']) . PHP_EOL;
            $insert = <<<EOT
                REPLACE INTO user(
                  id,
                  login,
                  first_name,
                  last_name,
                  birthday,
                  sex,
                  email,
                  street,
                  postcode,
                  locality,
                  country_id,
                  mobile_phone,
                  phone,
                  remarks,
                  iban,
                  has_insurance,
                  swiss_sailing,
                  swiss_sailing_type,
                  swiss_windsurf_type,
                  receives_newsletter,
                  family_relationship,
                  billing_type,
                  welcome_session_date,
                  status
                ) VALUES (
                  :id,
                  :login,
                  :first_name,
                  :last_name,
                  :birthday,
                  :sex,
                  :email,
                  :street,
                  :postcode,
                  :locality,
                  :country_id,
                  :mobile_phone,
                  :phone,
                  :remarks,
                  :iban,
                  :has_insurance,
                  :swiss_sailing,
                  :swiss_sailing_type,
                  :swiss_windsurf_type,
                  :receives_newsletter,
                  :family_relationship,
                  :billing_type,
                  :welcome_session_date,
                  :status
                )                
EOT;

            $insert = $conn->prepare($insert);
            $insert->bindValue('id', $user['uid']);
            $insert->bindValue('login', $user['new_username']);
            $insert->bindValue('first_name', $user['first_name']);
            $insert->bindValue('last_name', $user['last_name']);
            $insert->bindValue('birthday', $user['date_birth'] !== null && $user['date_birth'] !== '0000-00-00' ? $user['date_birth'] : null);
            $insert->bindValue('sex', $user['sexe'] === 'F' ? 2 : 1);
            $insert->bindValue('email', !empty($user['email']) ? $user['email'] : null);
            $insert->bindValue('street', $user['address']);
            $insert->bindValue('postcode', $user['zip']);
            $insert->bindValue('locality', $user['city']);

            switch ($user['country']) {
                case 'CH': $country_id = 1;

break;
                case 'FR': $country_id = 2;

break;
                case 'DE': $country_id = 10;

break;
                case 'CA': $country_id = 6;

break;
                case 'NL': $country_id = 19;

break;
                default:
                    $country_id = null;
                    echo sprintf("WARN: pas de correspondance pour le code pays %s de l\\'individu %u (%s &s)", $user['country'], $user['uid'], $user['first_name'], $user['last_name']) . PHP_EOL;
            }
            $insert->bindValue('country_id', $country_id);

            $insert->bindValue('mobile_phone', !empty($user['natel']) ? $user['natel'] : '');
            $insert->bindValue('phone', $user['telephone']);

            if ($user['uid'] === $user['family_uid']) {
                // Si responsable de l'adhésion, fusionne les notes au niveau du membre et de l'individu
                $remarks = implode(PHP_EOL, [$this->members[$user['family_uid']]['remarques'], $user['notes']]);
            } else {
                $remarks = !empty($user['notes']) ? $user['notes'] : '';
            }

            $insert->bindValue('remarks', $remarks);
            $insert->bindValue('iban', !empty($user['IBAN']) ? $user['IBAN'] : '');
            $insert->bindValue('has_insurance', !empty($this->members[$user['family_uid']]['assurances']) ? 1 : 0);

            $insert->bindValue('swiss_sailing', !empty($user['ichtus_swiss_sailing']) ? $user['ichtus_swiss_sailing'] : '');
            switch ($user['ichtus_swiss_sailing_type']) {
                case 'A': $swissSailingType = 'active';

break;
                case 'P': $swissSailingType = 'passive';

break;
                case 'J': $swissSailingType = 'junior';

break;
                default: $swissSailingType = null;
            }
            $insert->bindValue('swiss_sailing_type', $swissSailingType);

            switch ($user['ichtus_swiss_windsurf_type']) {
                case 'A': $swissWindsurfType = 'active';

break;
                case 'P': $swissWindsurfType = 'passive';

break;
                default: $swissWindsurfType = null;
            }
            $insert->bindValue('swiss_windsurf_type', $swissWindsurfType);

            $insert->bindValue('receives_newsletter', !empty($user['email']) ? 1 : 0);

            switch ($user['family_status']) {
                case 'chef de famille': $relationship = 'householder';

break;
                case 'chef(fe) de famille': $relationship = 'householder';

break;
                case 'conjoint': $relationship = 'partner';

break;
                case 'enfant': $relationship = 'child';

break;
                case 'parent': $relationship = 'parent';

break;
                case 'soeur': $relationship = 'sister';

break;
                case 'frère': $relationship = 'brother';

break;
                case 'beau-frère': $relationship = 'brother';

break;
                default:
                    $relationship = 'householder';
                    echo sprintf("WARN: individu %u (%s %s) n'a pas de statut familial", $user['uid'], $user['first_name'], $user['last_name']) . PHP_EOL;
            }
            $insert->bindValue('family_relationship', $relationship);

            if ($this->members[$user['family_uid']]['envoi_papier'] && empty($user['email'])) {
                $insert->bindValue('billing_type', 'paper');
            } else {
                $insert->bindValue('billing_type', 'electronic');
            }
            $insert->bindValue('welcome_session_date', $this->members[$user['family_uid']]["date_séance d'accueil"]);

            $userStatus = 'new';
            if ($user['status_new'] + $user['status_actif'] + $user['status_archived'] > 1) {
                echo sprintf('WARN individu %u (%s %s) a plus d\' un statut actif à la fois', $user['uid'], $user['first_name'], $user['last_name']) . PHP_EOL;
            }
            if ($user['status_actif']) {
                $userStatus = 'active';
            } elseif ($user['status_archived']) {
                $userStatus = 'archived';
            }
            $insert->bindValue('status', $userStatus);

            $insert->execute();
        }
    }

    /**
     * Convert MacRoman string to UTF-8
     *
     * @param mixed $string
     *
     * @return string
     */
    private function fromMacRoman($string): ?string
    {
        return !empty($string) ? iconv('MacRoman', 'UTF-8', $string) : $string;
    }

    /**
     * Delete existing test users prior importing to prevent an ID collision
     */
    private function deleteTestUsers(): void
    {
        $conn = _em()->getConnection();
        $result = $conn->executeQuery('SELECT id FROM account a where a.owner_id >= 1000 AND a.owner_id <= 1011');
        $accounts = $result->fetchAll(\PDO::FETCH_COLUMN);
        print_r($accounts);
        $stmt = $conn->prepare('DELETE tl, t FROM transaction_line tl JOIN transaction t ON tl.transaction_id = t.id WHERE FIND_IN_SET(CAST(tl.debit_id as char), :accounts) OR FIND_IN_SET(CAST(tl.credit_id as char), :accounts)');
        $stmt->bindValue('accounts', implode(',', $accounts));
        $stmt->execute();
        $stmt = $conn->prepare('DELETE FROM account WHERE FIND_IN_SET(CAST(id as char), :accounts)');
        $stmt->bindValue('accounts', implode(',', $accounts));
        $stmt->execute();
        $stmt = $conn->prepare('DELETE FROM message WHERE (creator_id >= 1000 AND creator_id <= 1011) OR (owner_id >= 1000 AND owner_id <= 1011)');
        $stmt->execute();
        $stmt = $conn->prepare('DELETE FROM user_tag WHERE (creator_id >= 1000 AND creator_id <= 1011) OR (owner_id >= 1000 AND owner_id <= 1011)');
        $stmt->execute();
        $stmt = $conn->prepare('DELETE FROM user_tag WHERE (creator_id >= 1000 AND creator_id <= 1011) OR (owner_id >= 1000 AND owner_id <= 1011)');
        $stmt->execute();
        $stmt = $conn->prepare('DELETE FROM expense_claim WHERE (creator_id >= 1000 AND creator_id <= 1011) OR (owner_id >= 1000 AND owner_id <= 1011)');
        $stmt->execute();
        $stmt = $conn->prepare('DELETE FROM booking WHERE (creator_id >= 1000 AND creator_id <= 1011) OR (owner_id >= 1000 AND owner_id <= 1011)');
        $stmt->execute();
        $stmt = $conn->prepare('SET FOREIGN_KEY_CHECKS=0; DELETE FROM user WHERE id >= 1000 AND id <= 1011; SET FOREIGN_KEY_CHECKS=1;');
        $stmt->execute();
    }
}
