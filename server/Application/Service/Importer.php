<?php

declare(strict_types=1);

namespace Application\Service;

use Application\Api\Exception;
use Doctrine\DBAL\Driver\PDOConnection;
use Doctrine\ORM\EntityManager;
use Interop\Container\ContainerInterface;

class Importer
{
    /**
     * @var ContainerInterface
     */
    private $container;

    /**
     * @var EntityManager
     */
    private $entityManager;

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
     * Storage requests
     *
     * @var array
     */
    private $storage = [];

    /**
     * Allocated storage
     * [idBookable] => number of bookings
     *
     * @var array
     */
    private $storageAllocated = [];

    /**
     * Import constructor
     */
    public function __construct(ContainerInterface $container, EntityManager $entityManager)
    {
        $this->container = $container;
        $this->entityManager = $entityManager;
    }

    /**
     * Import the members from FileMaker and TYPO3
     */
    public function import(): void
    {
        $this->loadMembers();
        $this->loadPeople();
//        $this->deleteTestUsers();
        $this->loadStorageRequests();
        $this->insertBookables();
        $this->insertUsers();
        $this->insertBookings();
    }

    /**
     * @return PDOConnection
     */
    private function connectFileMaker(): PDOConnection
    {
        if ($this->filemaker) {
            return $this->filemaker;
        }
        $config = $this->container->get('config');

        $dsn = sprintf('odbc:Driver={%s};Server=%s;Database=%s;charset=UTF-8', $config['filemaker']['driver'], $config['filemaker']['host'], $config['filemaker']['dbname']);
        $this->filemaker = new PDOConnection($dsn, $config['filemaker']['user'], $config['filemaker']['password']);

        return $this->filemaker;
    }

    /**
     * @return PDOConnection
     */
    private function connectTypo3(): PDOConnection
    {
        if ($this->typo3) {
            return $this->typo3;
        }
        $config = $this->container->get('config');

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
          WHERE FIND_IN_SET(CAST(family_uid as char), :members) AND status_archived=0;
EOT;
        $statement = $this->typo3->prepare($query);
        $statement->bindValue(':members', implode(',', array_keys($this->members)));

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
        $conn = $this->entityManager->getConnection();

        $typo3 = $this->connectTypo3();

        $insert = <<<EOT
                INSERT INTO user(
                  id,
                  login,
                  password,
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
                  internal_remarks,
                  iban,
                  has_insurance,
                  swiss_sailing,
                  swiss_sailing_type,
                  swiss_windsurf_type,
                  receives_newsletter,
                  role,
                  family_relationship,
                  billing_type,
                  welcome_session_date,
                  status,
                  creation_date,
                  door4
                ) VALUES (
                  :id,
                  :login,
                  :password,
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
                  :role,
                  :family_relationship,
                  :billing_type,
                  :welcome_session_date,
                  :status,
                  :creation_date,
                  :door4
                )
EOT;
        $insert = $conn->prepare($insert);

        $createAccount = <<<EOT
                INSERT INTO account(
                  owner_id,
                  creation_date,
                  balance,
                  name,
                  parent_id,
                  type,
                  code
                ) VALUES (
                  :owner,
                  NOW(),
                  :balance,
                  :name,
                  10011, -- Passifs -> 2030 Acomptes de clients
                  'liability',
                  :code
                )
EOT;
        $createAccount = $conn->prepare($createAccount);

        $linkToTag = $conn->prepare('INSERT INTO user_tag_user(user_tag_id, user_id) VALUES (:user_tag_id, :user_id)');

        $linkToLicense = $conn->prepare('INSERT INTO license_user(license_id, user_id) VALUES (:license_id, :user_id)');

        $exportPassword = $typo3->prepare('UPDATE fe_users SET new_password=:password WHERE uid=:user_id');

        foreach ($this->users as $user) {
            echo sprintf('Insert user %u (%s %s)', $user['uid'], $user['first_name'], $user['last_name']) . PHP_EOL;
            $insert->bindValue(':id', $user['uid']);
            $insert->bindValue(':login', $user['new_username']);
            $insert->bindValue(':first_name', $user['first_name']);
            $insert->bindValue(':last_name', $user['last_name']);
            $insert->bindValue(':birthday', $user['date_birth'] !== null && $user['date_birth'] !== '0000-00-00' ? $user['date_birth'] : null);
            $insert->bindValue(':sex', $user['sexe'] === 'F' ? 2 : 1);
            $insert->bindValue(':email', !empty($user['email']) ? $user['email'] : null);
            $insert->bindValue(':street', $user['address']);
            $insert->bindValue(':postcode', $user['zip']);
            $insert->bindValue(':locality', $user['city']);

            switch ($user['country']) {
                case 'CH':
                    $country_id = 1;

                    break;
                case 'FR':
                case 'France':
                    $country_id = 2;

                    break;
                case 'DE':
                    $country_id = 10;

                    break;
                case 'CA':
                    $country_id = 6;

                    break;
                case 'NL':
                    $country_id = 19;

                    break;
                default:
                    $country_id = null;
                    echo sprintf("WARN: pas de correspondance pour le code pays %s de l\\'individu %u (%s %s)", $user['country'], $user['uid'], $user['first_name'], $user['last_name']) . PHP_EOL;
            }
            $insert->bindValue(':country_id', $country_id);

            $insert->bindValue(':mobile_phone', !empty($user['natel']) ? $user['natel'] : '');
            $insert->bindValue(':phone', $user['telephone']);

            if ($user['uid'] === $user['family_uid']) {
                // Si responsable de l'adhésion, fusionne les notes au niveau du membre et de l'individu
                $remarks = implode(PHP_EOL, [$this->members[$user['family_uid']]['remarques'], $user['notes']]);
            } else {
                $remarks = !empty($user['notes']) ? $user['notes'] : '';
            }

            $insert->bindValue(':remarks', $remarks);
            $insert->bindValue(':iban', !empty($user['IBAN']) ? $user['IBAN'] : '');

            $hasInsurance = false;
            if (empty($this->members[$user['family_uid']]['assurances'])) {
                echo sprintf('WARN: membre %u n\'a aucune assurance -> fond de réparation forcé', $user['family_uid']) . PHP_EOL;
                $this->members[$user['family_uid']]['assurances'] = 'Fonds réparation';
            } elseif (mb_strpos($this->members[$user['family_uid']]['assurances'], 'RC privée') !== false) {
                $hasInsurance = true;
            }
            $insert->bindValue(':has_insurance', $hasInsurance);

            $insert->bindValue(':swiss_sailing', !empty($user['ichtus_swiss_sailing']) ? $user['ichtus_swiss_sailing'] : '');
            switch ($user['ichtus_swiss_sailing_type']) {
                case 'A':
                    $swissSailingType = 'active';

                    break;
                case 'P':
                    $swissSailingType = 'passive';

                    break;
                case 'J':
                    $swissSailingType = 'junior';

                    break;
                default:
                    $swissSailingType = null;
            }
            $insert->bindValue(':swiss_sailing_type', $swissSailingType);

            switch ($user['ichtus_swiss_windsurf_type']) {
                case 'A':
                    $swissWindsurfType = 'active';

                    break;
                case 'P':
                    $swissWindsurfType = 'passive';

                    break;
                default:
                    $swissWindsurfType = null;
            }
            $insert->bindValue(':swiss_windsurf_type', $swissWindsurfType);

            $insert->bindValue(':receives_newsletter', !empty($user['email']) ? 1 : 0);

            switch ($user['family_status']) {
                case 'chef de famille':
                    $relationship = 'householder';
                    $role = 'member';

                    break;
                case 'chef(fe) de famille':
                    $relationship = 'householder';
                    $role = 'member';

                    break;
                case 'conjoint':
                    $relationship = 'partner';
                    $role = 'individual';

                    break;
                case 'enfant':
                    $relationship = 'child';
                    $role = 'individual';

                    break;
                case 'parent':
                    $relationship = 'parent';
                    $role = 'individual';

                    break;
                case 'soeur':
                    $relationship = 'sister';
                    $role = 'individual';

                    break;
                case 'frère':
                    $relationship = 'brother';
                    $role = 'individual';

                    break;
                case 'beau-frère':
                    $relationship = 'brother';
                    $role = 'individual';

                    break;
                default:
                    $relationship = 'householder';
                    $role = 'individual';
                    echo sprintf("WARN: individu %u (%s %s) n'a pas de statut familial", $user['uid'], $user['first_name'], $user['last_name']) . PHP_EOL;
            }
            if (in_array((int) $user['uid'], [1057, 2738], true)) {
                $role = 'administrator';
            } elseif (!empty($user['ichtus_comite_fonction'])) {
                $role = 'responsible';
            }
            $insert->bindValue(':role', $role);
            $insert->bindValue(':door4', (int) in_array($role, ['responsible', 'administrator'], true));
            $insert->bindValue(':family_relationship', $relationship);

            if ($this->members[$user['family_uid']]['envoi_papier'] && empty($user['email'])) {
                $insert->bindValue(':billing_type', 'paper');
            } else {
                $insert->bindValue(':billing_type', 'electronic');
            }
            $insert->bindValue(':welcome_session_date', $this->members[$user['family_uid']]["date_séance d'accueil"]);

            $userStatus = 'new';
            if ($user['status_new'] + $user['status_actif'] + $user['status_archived'] > 1) {
                echo sprintf('WARN individu %u (%s %s) a plus d\' un statut actif à la fois', $user['uid'], $user['first_name'], $user['last_name']) . PHP_EOL;
            }

            if ($this->members[$user['family_uid']]['membre_suspension']) {
                $userStatus = 'inactive';
            } elseif ($user['status_actif']) {
                $userStatus = 'active';
            } elseif ($user['status_archived']) {
                $userStatus = 'archived';
            }
            $insert->bindValue(':status', $userStatus);

            $insert->bindValue(':creation_date', $this->members[$user['family_uid']]['date_entrée ichtus']);

            // Generate a new random password and store it in TYPO3 fe_users to send a newsletter to users
            $password = $this->generatePassword();
            $exportPassword->bindValue(':password', $password);
            $exportPassword->bindValue(':user_id', $user['uid']);
            $exportPassword->execute();
            $insert->bindValue(':password', password_hash($password, PASSWORD_DEFAULT));

            if ($insert->execute() === false) {
                echo sprintf('ERROR: création de l\'individu %u (%s %s)', $user['uid'], $user['first_name'], $user['last_name']) . PHP_EOL;

                continue;
            }

            // Crée un compte débiteur pour le membre
            $createAccount->bindValue(':owner', $user['uid']);
            $createAccount->bindValue(':name', implode(' ', [$user['first_name'], $user['last_name']]));
            $accountNumber = sprintf('2030%04u', $user['uid']); // 2030 (Acomptes de client) & ID User = numéro de compte unique
            $createAccount->bindValue(':code', $accountNumber);
            $createAccount->bindValue(':balance', 0.00); // Importer le solde des comptes 2018 ?
            if ($createAccount->execute() === false) {
                echo sprintf('ERROR: échec de création de compte débiteur n°%u pour l\'utilisateur %u (%s %s)', $accountNumber, $user['uid'], $user['first_name'], $user['last_name']) . PHP_EOL;
            }

            // Assigne les tags au membre
            if (!empty($user['ichtus_comite_fonction'])) {
                $userTagId = $this->insertUserTag($user['ichtus_comite_fonction']);
                $linkToTag->bindValue(':user_id', $user['uid']);
                $linkToTag->bindValue(':user_tag_id', $userTagId);
                $linkToTag->execute();
            }
            if (!empty($this->users[$user['uid']]['ichtus_NFT'])) {
                $userTagId = $this->insertUserTag('Membre NFT');
                $linkToTag->bindValue(':user_id', $user['uid']);
                $linkToTag->bindValue(':user_tag_id', $userTagId);
                $linkToTag->execute();
            }

            // Assigne les brevets au membre
            $linkToLicense->bindValue(':user_id', $user['uid']);
            switch ($user['ichtus_autvoile']) {
                case 1: $idLicense = 2000;

break; // Voile niveau 1
                case 2: $idLicense = 2001;

break; // Voile niveau 2
                case 3: $idLicense = 2002;

break; // Voile niveau 3
                default: $idLicense = null;
            }
            if ($idLicense) {
                echo sprintf('%s %s: brevet voile niveau %u', $user['first_name'], $user['last_name'], $user['ichtus_autvoile']) . PHP_EOL;
                $linkToLicense->bindValue(':license_id', $idLicense);
                $linkToLicense->execute();
            }
        }

        $updateOwner = $conn->prepare('UPDATE user SET owner_id=:owner WHERE id=:id');
        foreach ($this->users as $user) {
            if ($user['family_uid'] && $user['family_uid'] !== $user['uid']) {
                // Update family ownership
                $updateOwner->bindValue(':owner', $user['family_uid']);
                $updateOwner->bindValue(':id', $user['uid']);
                $updateOwner->execute();
            }
        }
    }

    public function loadStorageRequests(): void
    {
        $this->connectTypo3();
        $query = 'SELECT * FROM tx_speciality_storage_places';
        $statement = $this->typo3->prepare($query);

        if ($statement->execute()) {
            echo sprintf('%u demandes d\'emplacement de stockage à importer...', $statement->rowCount()) . PHP_EOL;
            foreach ($statement->fetchAll(\PDO::FETCH_ASSOC) as $request) {
                if (!array_key_exists($request['uid_link'], $this->members)) {
                    echo sprintf('WARN: demande de stockage %u pour membre %u (%s %s) introuvable', $request['uid'], $request['uid_link'], $request['first_name'], $request['last_name']) . PHP_EOL;
                }
                $this->storage[$request['uid_link']] = $request;
            }
        }
    }

    /**
     * Create bookables (storage lockers, cabinets, space for boats)
     */
    private function insertBookables(): void
    {
        $conn = $this->entityManager->getConnection();

        $insert = <<<EOT
                INSERT INTO bookable(
                  code,
                  name,
                  description,
                  initial_price,
                  periodic_price,
                  simultaneous_booking_maximum,
                  booking_type,
                  creation_date,
                  credit_account_id
                ) VALUES (
                  :code,
                  :name,
                  :description,
                  :initial_price,
                  :periodic_price,
                  :simultaneous_booking_maximum,
                  :booking_type,
                  NOW(),
                  10036 -- Vente de prestations -> Location casiers
                )
EOT;

        $insert = $conn->prepare($insert);

        $linkToTag = $conn->prepare('INSERT INTO bookable_tag_bookable(bookable_tag_id, bookable_id) VALUES (:bookable_tag_id, :bookable_id)');

        // Armoires
        $insert->bindValue(':initial_price', 0);
        $insert->bindValue(':periodic_price', 50);
        // Une armoire peut être partagée entre 2 ou 3 membres
        $insert->bindValue(':simultaneous_booking_maximum', 3);

        /*
         * admin_only, because l'attribution d'un casier particulier est faite par l'admin,
         * bien que le membre demande un "Casier" il ne doit pas pouvoir réserver "Casier 26"
         */
        $insert->bindValue(':booking_type', 'admin_only');

        $insert->bindValue(':description', 'Armoire (50 x 200 x 70 cm)');
        for ($i = 1; $i <= 120; ++$i) {
            $insert->bindValue(':name', sprintf('Armoire %u', $i));
            $insert->bindValue(':code', sprintf('STA%u', $i));
            $insert->execute();
            $linkToTag->bindValue(':bookable_id', $conn->lastInsertId());
            $linkToTag->bindValue(':bookable_tag_id', $this->insertBookableTag('Armoire'));
            $linkToTag->execute();
            $linkToTag->bindValue(':bookable_tag_id', $this->insertBookableTag('Stockage'));
            $linkToTag->execute();
        }

        // Casiers
        $insert->bindValue(':periodic_price', 30);
        $insert->bindValue(':simultaneous_booking_maximum', 1);
        $insert->bindValue(':description', 'Casier (50 x 50 x 70 cm)');
        for ($i = 1; $i <= 36; ++$i) {
            $insert->bindValue(':name', sprintf('Casier %u', $i));
            $insert->bindValue(':code', sprintf('STC%u', $i));
            $insert->execute();
            $linkToTag->bindValue(':bookable_id', $conn->lastInsertId());
            $linkToTag->bindValue(':bookable_tag_id', $this->insertBookableTag('Casier'));
            $linkToTag->execute();
            $linkToTag->bindValue(':bookable_tag_id', $this->insertBookableTag('Stockage'));
            $linkToTag->execute();
        }
    }

    /**
     * Create periodic bookings for all members
     */
    private function insertBookings(): void
    {
        $conn = $this->entityManager->getConnection();

        $insert = <<<EOT
                INSERT INTO booking(
                  owner_id,
                  creation_date,
                  status,
                  participant_count,
                  start_date,
                  bookable_id
                ) VALUES (
                  :owner,
                  NOW(),
                  :status,
                  :participant_count,
                  NOW(),
                  :bookable
                )
EOT;

        $insert = $conn->prepare($insert);
        $insert->bindValue(':status', 'booked');
        $insert->bindValue(':participant_count', 1);

        // Réservations liées au chef de famille
        foreach ($this->members as $idMember => $member) {
            // Cotisation annuelle
            $insert->bindValue(':owner', $idMember);
            $insert->bindValue(':bookable', 3006); // Cotisation annuelle
            $insert->execute();

            // Fond de réparation (optionnel)
            if (!empty($member['assurances']) && mb_strpos($member['assurances'], 'Fonds réparation') !== false) {
                $insert->bindValue(':bookable', 3026); // Fonds de réparation interne
                $insert->execute();
            }
        }

        // Réservations liées aux individus (mais facturées au chef de famille)
        foreach ($this->users as $idUser => $user) {
            $insert->bindValue(':owner', $idUser);

            // Adhésion NFT (optionnel)
            if (!empty($user['ichtus_NFT'])) {
                $insert->bindValue(':bookable', 3004); // Cotisation NFT
                $insert->execute();
            }

            // Licence Swiss Sailing
            if (!empty($user['ichtus_swiss_sailing'])) {
                switch ($user['ichtus_swiss_sailing_type']) {
                    case 'A':
                        $idBookable = 3027; // Licence Swiss Sailing (voile)
                        break;
                    case 'J':
                        $idBookable = 3030; // Cotisation Swiss Sailing (NFT, junior)
                        break;
                    default:
                        $idBookable = null;
                }
                if ($idBookable) {
                    $insert->bindValue(':bookable', $idBookable);
                    $insert->execute();
                }
            }

            // Licence Swiss Windsurfing
            if (!empty($user['ichtus_swiss_windsurf_type']) && $user['ichtus_swiss_windsurf_type'] === 'A') {
                $insert->bindValue(':bookable', 3028); // Cotisation Swiss Windsurfing (NFT)
                $insert->execute();
            }
        }

        // Attribution des emplacements de stockage
        $selectBookableByName = $conn->prepare('SELECT id, name, simultaneous_booking_maximum FROM bookable WHERE name=:name');
        foreach ($this->storage as $request) {
            if (empty($request['uid_link']) || !array_key_exists($request['uid_link'], $this->members)) {
                echo sprintf('ERROR: UID membre de %s %s inconnu dans fichier de demande de stockage', $request['first_name'], $request['last_name']) . PHP_EOL;

                continue;
            }
            $insert->bindValue(':owner', $request['uid_link']);
            foreach ([1 => 'Armoire %u', 2 => 'Armoire %u', 3 => 'Casier %u'] as $index => $bookableName) {
                if ($request["materiel{$index}"] > 0 && !empty($request["materiel{$index}attrib"])) {
                    $selectBookableByName->bindValue(':name', sprintf($bookableName, $request["materiel{$index}attrib"]));
                    $bookable = null;
                    if ($selectBookableByName->execute() && $selectBookableByName->rowCount() === 1) {
                        $bookable = $selectBookableByName->fetch(\PDO::FETCH_ASSOC);
                    }
                    if ($bookable) {
                        $insert->bindValue(':bookable', $bookable['id']);
                        $insert->execute();
                        if (!array_key_exists($bookable['id'], $this->storageAllocated)) {
                            $this->storageAllocated[$bookable['id']] = 1;
                        } else {
                            $this->storageAllocated[$bookable['id']] += 1;
                        }
                        echo sprintf('%s attribué à %s %s', $bookable['name'], $this->users[$request['uid_link']]['first_name'], $this->users[$request['uid_link']]['last_name']) . PHP_EOL;
                        if ($this->storageAllocated[$bookable['id']] > $bookable['simultaneous_booking_maximum']) {
                            echo sprintf('WARN: %s attribué %u fois dépassant la limite de %u', $bookable['name'], $this->storageAllocated[$bookable], $bookable['simultaneous_booking_maximum']) . PHP_EOL;
                        }
                    } else {
                        echo sprintf("ERROR: cannot find $bookableName in bookables", $request["materiel{$index}attrib"]) . PHP_EOL;
                    }
                }
            }
        }
    }

    /**
     * Insert or find an user tag by name
     *
     * @param string $name
     *
     * @return int ID of the existing or newly tag
     */
    private function insertUserTag(string $name): int
    {
        $conn = $this->entityManager->getConnection();

        $existing = $conn->prepare('SELECT id FROM user_tag WHERE name = :name');
        $existing->bindValue(':name', $name);
        $existing->execute();
        if ($existing->rowCount()) {
            return (int) $existing->fetchColumn();
        }

        $insert = $conn->prepare('INSERT INTO user_tag(creation_date, name) VALUES (NOW(), :name)');
        $insert->bindValue(':name', $name);
        if ($insert->execute()) {
            return (int) $conn->lastInsertId();
        }

        throw new Exception(sprintf('Cannot find or insert UserTag "%s"', $name));
    }

    /**
     * Insert or find a bookable tag by name
     *
     * @param string $name
     *
     * @return int ID of the existing or newly tag
     */
    private function insertBookableTag(string $name): int
    {
        $conn = $this->entityManager->getConnection();

        $existing = $conn->prepare('SELECT id FROM bookable_tag WHERE name = :name');
        $existing->bindValue(':name', $name);
        $existing->execute();
        if ($existing->rowCount()) {
            return (int) $existing->fetchColumn();
        }

        $insert = $conn->prepare('INSERT INTO bookable_tag(creation_date, name) VALUES (NOW(), :name)');
        $insert->bindValue(':name', $name);
        if ($insert->execute()) {
            return (int) $conn->lastInsertId();
        }

        throw new Exception(sprintf('Cannot find or insert BookableTag "%s"', $name));
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
        $conn = $this->entityManager->getConnection();
        $result = $conn->executeQuery('SELECT id FROM account a where a.owner_id < 0');
        $accounts = $result->fetchAll(\PDO::FETCH_COLUMN);
        $stmt = $conn->prepare('DELETE tl, t FROM transaction_line tl JOIN transaction t ON tl.transaction_id = t.id WHERE FIND_IN_SET(CAST(tl.debit_id as char), :accounts) OR FIND_IN_SET(CAST(tl.credit_id as char), :accounts)');
        $stmt->bindValue('accounts', implode(',', $accounts));
        $stmt->execute();
        $stmt = $conn->prepare('DELETE FROM account WHERE FIND_IN_SET(CAST(id as char), :accounts)');
        $stmt->bindValue('accounts', implode(',', $accounts));
        $stmt->execute();
        $stmt = $conn->prepare('DELETE FROM message WHERE creator_id < 0 OR owner_id < 0');
        $stmt->execute();
        $stmt = $conn->prepare('DELETE FROM user_tag WHERE creator_id < 0 OR owner_id < 0');
        $stmt->execute();
        $stmt = $conn->prepare('DELETE FROM user_tag WHERE creator_id < 0 OR owner_id < 0');
        $stmt->execute();
        $stmt = $conn->prepare('DELETE FROM expense_claim WHERE creator_id < 0 OR owner_id < 0');
        $stmt->execute();
        $stmt = $conn->prepare('DELETE FROM booking WHERE creator_id < 0 OR owner_id < 0');
        $stmt->execute();
        $stmt = $conn->prepare('UPDATE user set owner_id = NULL WHERE id < 0');
        $stmt->execute();
        $stmt = $conn->prepare('DELETE FROM user WHERE id < 0');
        $stmt->execute();
    }

    /**
     * Generate password string which evaluate to "medium" security level by digitalspagethi mix
     *
     * @param int $length length of password
     *
     * @return string
     */
    private function generatePassword(int $length = 10): string
    {
        $numberLength = 2;
        $vowels = 'aeuyAEUY';
        $consonants = 'bdghjmnpqrstvzBDGHJLMNPQRSTVWXZ';
        $numbers = '23456789';

        $password = '';
        $alt = time() % 2;
        for ($i = 0; $i < $length - $numberLength; ++$i) {
            if ($alt === 1) {
                $password .= $consonants[(mt_rand() % mb_strlen($consonants))];
                $alt = 0;
            } else {
                $password .= $vowels[(mt_rand() % mb_strlen($vowels))];
                $alt = 1;
            }
        }

        for ($i = 0; $i < $numberLength; ++$i) {
            $password .= $numbers[(mt_rand() % mb_strlen($numbers))];
        }

        return $password;
    }
}
