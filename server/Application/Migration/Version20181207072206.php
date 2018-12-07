<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20181207072206 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE user_tag (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, name VARCHAR(191) NOT NULL, color VARCHAR(7) DEFAULT \'\' NOT NULL, INDEX IDX_E89FD60861220EA6 (creator_id), INDEX IDX_E89FD6087E3C61F9 (owner_id), INDEX IDX_E89FD608E37ECFB0 (updater_id), UNIQUE INDEX unique_name (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_tag_user (user_tag_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_83118DFFDF80782C (user_tag_id), INDEX IDX_83118DFFA76ED395 (user_id), PRIMARY KEY(user_tag_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE bookable (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, type_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, initial_price NUMERIC(10, 0) DEFAULT \'0\' NOT NULL, periodic_price NUMERIC(10, 0) DEFAULT \'0\' NOT NULL, simultaneous_booking_maximum SMALLINT UNSIGNED DEFAULT 1 NOT NULL, booking_type ENUM(\'self_approved\', \'admin_approved\', \'admin_only\', \'mandatory\') DEFAULT \'self_approved\' NOT NULL COMMENT \'(DC2Type:BookingType)\', name VARCHAR(191) NOT NULL, description TEXT NOT NULL, code VARCHAR(10) DEFAULT \'\' NOT NULL, INDEX IDX_A10B812461220EA6 (creator_id), INDEX IDX_A10B81247E3C61F9 (owner_id), INDEX IDX_A10B8124E37ECFB0 (updater_id), INDEX IDX_A10B8124C54C8C93 (type_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE image (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, bookable_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, filename VARCHAR(2000) NOT NULL, width INT NOT NULL, height INT NOT NULL, INDEX IDX_C53D045F61220EA6 (creator_id), INDEX IDX_C53D045F7E3C61F9 (owner_id), INDEX IDX_C53D045FE37ECFB0 (updater_id), INDEX IDX_C53D045FEC4F5B2F (bookable_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE country (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, code VARCHAR(2) NOT NULL, name VARCHAR(191) NOT NULL, UNIQUE INDEX UNIQ_5373C96677153098 (code), INDEX IDX_5373C96661220EA6 (creator_id), INDEX IDX_5373C9667E3C61F9 (owner_id), INDEX IDX_5373C966E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE booking (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, responsible_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, status ENUM(\'application\', \'booked\', \'processed\') DEFAULT \'application\' NOT NULL COMMENT \'(DC2Type:BookingStatus)\', participant_count INT UNSIGNED DEFAULT 1 NOT NULL, destination VARCHAR(50) DEFAULT \'\' NOT NULL, start_comment TEXT NOT NULL, end_comment TEXT NOT NULL, start_date DATETIME NOT NULL, end_date DATETIME DEFAULT NULL, estimated_end_date VARCHAR(50) DEFAULT \'\' NOT NULL, INDEX IDX_E00CEDDE61220EA6 (creator_id), INDEX IDX_E00CEDDE7E3C61F9 (owner_id), INDEX IDX_E00CEDDEE37ECFB0 (updater_id), INDEX IDX_E00CEDDE602AD315 (responsible_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE booking_bookable (booking_id INT NOT NULL, bookable_id INT NOT NULL, INDEX IDX_9A3F1FA93301C60 (booking_id), INDEX IDX_9A3F1FA9EC4F5B2F (bookable_id), PRIMARY KEY(booking_id, bookable_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE bookable_type (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, name VARCHAR(191) NOT NULL, INDEX IDX_B161DE161220EA6 (creator_id), INDEX IDX_B161DE17E3C61F9 (owner_id), INDEX IDX_B161DE1E37ECFB0 (updater_id), UNIQUE INDEX unique_name (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE license (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, name VARCHAR(191) NOT NULL, INDEX IDX_5768F41961220EA6 (creator_id), INDEX IDX_5768F4197E3C61F9 (owner_id), INDEX IDX_5768F419E37ECFB0 (updater_id), UNIQUE INDEX unique_name (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE license_bookable (license_id INT NOT NULL, bookable_id INT NOT NULL, INDEX IDX_5D5B1013460F904B (license_id), INDEX IDX_5D5B1013EC4F5B2F (bookable_id), PRIMARY KEY(license_id, bookable_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE license_user (license_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_77C835A460F904B (license_id), INDEX IDX_77C835AA76ED395 (user_id), PRIMARY KEY(license_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, responsible_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, login VARCHAR(50) NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(191) NOT NULL, role ENUM(\'inactive\', \'booking_only\', \'member\', \'responsible\', \'administrator\') DEFAULT \'member\' NOT NULL COMMENT \'(DC2Type:UserRole)\', active_until DATETIME DEFAULT NULL, phone VARCHAR(25) DEFAULT \'\' NOT NULL, birthday DATE DEFAULT NULL, name VARCHAR(191) NOT NULL, door1 TINYINT(1) DEFAULT \'1\' NOT NULL, door2 TINYINT(1) DEFAULT \'1\' NOT NULL, door3 TINYINT(1) DEFAULT \'1\' NOT NULL, door4 TINYINT(1) DEFAULT \'0\' NOT NULL, UNIQUE INDEX UNIQ_8D93D649AA08CB10 (login), INDEX IDX_8D93D64961220EA6 (creator_id), INDEX IDX_8D93D6497E3C61F9 (owner_id), INDEX IDX_8D93D649E37ECFB0 (updater_id), INDEX IDX_8D93D649602AD315 (responsible_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_tag ADD CONSTRAINT FK_E89FD60861220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_tag ADD CONSTRAINT FK_E89FD6087E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_tag ADD CONSTRAINT FK_E89FD608E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_tag_user ADD CONSTRAINT FK_83118DFFDF80782C FOREIGN KEY (user_tag_id) REFERENCES user_tag (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_tag_user ADD CONSTRAINT FK_83118DFFA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE bookable ADD CONSTRAINT FK_A10B812461220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE bookable ADD CONSTRAINT FK_A10B81247E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE bookable ADD CONSTRAINT FK_A10B8124E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE bookable ADD CONSTRAINT FK_A10B8124C54C8C93 FOREIGN KEY (type_id) REFERENCES bookable_type (id)');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045F61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045F7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045FE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045FEC4F5B2F FOREIGN KEY (bookable_id) REFERENCES bookable (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE country ADD CONSTRAINT FK_5373C96661220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE country ADD CONSTRAINT FK_5373C9667E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE country ADD CONSTRAINT FK_5373C966E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE booking ADD CONSTRAINT FK_E00CEDDE61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE booking ADD CONSTRAINT FK_E00CEDDE7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE booking ADD CONSTRAINT FK_E00CEDDEE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE booking ADD CONSTRAINT FK_E00CEDDE602AD315 FOREIGN KEY (responsible_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE booking_bookable ADD CONSTRAINT FK_9A3F1FA93301C60 FOREIGN KEY (booking_id) REFERENCES booking (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE booking_bookable ADD CONSTRAINT FK_9A3F1FA9EC4F5B2F FOREIGN KEY (bookable_id) REFERENCES bookable (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE bookable_type ADD CONSTRAINT FK_B161DE161220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE bookable_type ADD CONSTRAINT FK_B161DE17E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE bookable_type ADD CONSTRAINT FK_B161DE1E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE license ADD CONSTRAINT FK_5768F41961220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE license ADD CONSTRAINT FK_5768F4197E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE license ADD CONSTRAINT FK_5768F419E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE license_bookable ADD CONSTRAINT FK_5D5B1013460F904B FOREIGN KEY (license_id) REFERENCES license (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE license_bookable ADD CONSTRAINT FK_5D5B1013EC4F5B2F FOREIGN KEY (bookable_id) REFERENCES bookable (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE license_user ADD CONSTRAINT FK_77C835A460F904B FOREIGN KEY (license_id) REFERENCES license (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE license_user ADD CONSTRAINT FK_77C835AA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D64961220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D6497E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649602AD315 FOREIGN KEY (responsible_id) REFERENCES user (id) ON DELETE SET NULL');

        $this->addSql('INSERT INTO country (id, code, name) VALUES
(1, "CH", "Suisse"),
(2, "FR", "France"),
(3, "AU", "Australie"),
(4, "AT", "Autriche"),
(5, "BE", "Belgique"),
(6, "CA", "Canada"),
(7, "CZ", "République tchèque"),
(8, "DK", "Danemark"),
(9, "FI", "Finlande"),
(10, "DE", "Allemagne"),
(11, "GR", "Grèce"),
(12, "HU", "Hongrie"),
(13, "IS", "Islande"),
(14, "IE", "Irlande"),
(15, "IT", "Italie"),
(16, "JP", "Japon"),
(17, "LU", "Luxembourg"),
(18, "MX", "Mexique"),
(19, "NL", "Pays-Bas"),
(20, "NZ", "Nouvelle-Zélande"),
(21, "NO", "Norvège"),
(22, "PL", "Pologne"),
(23, "PT", "Portugal"),
(24, "SK", "Slovaquie"),
(25, "KR", "Corée du Sud"),
(26, "ES", "Espagne"),
(27, "SE", "Suède"),
(28, "TR", "Turquie"),
(29, "GB", "Angleterre"),
(30, "US", "États-Unis"),
(31, "AX", "Îles Åland"),
(32, "AF", "Afghanistan"),
(33, "AL", "Albanie"),
(34, "DZ", "Algérie"),
(35, "AS", "Samoa américaines"),
(36, "AD", "Andorre"),
(37, "AO", "Angola"),
(38, "AI", "Anguilla"),
(39, "AQ", "Antarctique"),
(40, "AG", "Antigua et Barbuda"),
(41, "AR", "Argentine"),
(42, "AM", "Arménie"),
(43, "AW", "Aruba"),
(44, "AZ", "Azerbaïdjan"),
(45, "BS", "Bahamas"),
(46, "BH", "Bahreïn"),
(47, "BD", "Bangladesh"),
(48, "BB", "Barbade"),
(49, "BY", "Biélorussie"),
(50, "BZ", "Belize"),
(51, "BJ", "Bénin"),
(52, "BM", "Bermudes"),
(53, "BT", "Bhutan"),
(54, "BO", "Bolivie"),
(55, "BQ", "Bonaire, Saint-Eustache et Saba"),
(56, "BA", "Bosnie-Herzégovine"),
(57, "BW", "Botswana"),
(58, "BV", "Île Bouvet"),
(59, "BR", "Brésil"),
(60, "IO", "Territoire britannique de l\'océan Indien"),
(61, "VG", "Îles Vierges"),
(62, "BN", "Brunéi Darussalam"),
(63, "BG", "Bulgarie"),
(64, "BF", "Burkina Faso"),
(65, "BI", "Burundi"),
(66, "KH", "Cambodge"),
(67, "CM", "Cameroun"),
(68, "CV", "Cap-Vert"),
(69, "KY", "Îles Caïmans"),
(70, "CF", "Centrafrique"),
(71, "TD", "Tchad"),
(72, "CL", "Chili"),
(73, "CN", "Chine"),
(74, "CX", "Île Christmas"),
(75, "CC", "Îles Cocos"),
(76, "CO", "Colombie"),
(77, "KM", "Comores"),
(78, "CK", "Îles Cook"),
(79, "CR", "Costa Rica"),
(80, "HR", "Croatie"),
(81, "CU", "Cuba"),
(82, "CW", "Curaçao"),
(83, "CY", "Chypre"),
(84, "CD", "République démocratique du Congo"),
(85, "DJ", "Djibouti"),
(86, "DM", "Dominique"),
(87, "DO", "République Dominicaine"),
(88, "TL", "Timor Oriental"),
(89, "EC", "Équateur"),
(90, "EG", "Égypte"),
(91, "SV", "Salvador"),
(92, "GQ", "Guinée équatoriale"),
(93, "ER", "Érythrée"),
(94, "EE", "Estonie"),
(95, "ET", "Éthiopie"),
(96, "FK", "Îles Malouines"),
(97, "FO", "Îles Féroé"),
(98, "FJ", "Fidji"),
(99, "GF", "Guyane"),
(100, "PF", "Polynésie Française"),
(101, "TF", "Terres australes françaises"),
(102, "GA", "Gabon"),
(103, "GM", "Gambie"),
(104, "GE", "Géorgie"),
(105, "GH", "Ghana"),
(106, "GI", "Gibraltar"),
(107, "GL", "Groenland"),
(108, "GD", "Grenade"),
(109, "GP", "Guadeloupe"),
(110, "GU", "Guam"),
(111, "GT", "Guatemala"),
(112, "GG", "Guernesey"),
(113, "GN", "Guinée"),
(114, "GW", "Guinée-Bissau"),
(115, "GY", "Guyana"),
(116, "HT", "Haïti"),
(117, "HM", "Île Heard et îles McDonald"),
(118, "HN", "Honduras"),
(119, "HK", "Hong Kong"),
(120, "IN", "Inde"),
(121, "ID", "Indonésie"),
(122, "IR", "Iran"),
(123, "IQ", "Irak"),
(124, "IM", "Île de Man"),
(125, "IL", "Israël"),
(126, "CI", "Côte d\'Ivoire"),
(127, "JM", "Jamaïque"),
(128, "JE", "Jersey"),
(129, "JO", "Jordanie"),
(130, "KZ", "Kazakhstan"),
(131, "KE", "Kenya"),
(132, "KI", "Kiribati"),
(133, "XK", "Kosovo"),
(134, "KW", "Koweït"),
(135, "KG", "Kirghizistan"),
(136, "LA", "Laos"),
(137, "LV", "Lettonie"),
(138, "LB", "Liban"),
(139, "LS", "Lesotho"),
(140, "LR", "Liberia"),
(141, "LY", "Libye"),
(142, "LI", "Liechtenstein"),
(143, "LT", "Lituanie"),
(144, "MO", "Macao"),
(145, "MK", "Macédoine"),
(146, "MG", "Madagascar"),
(147, "MW", "Malawi"),
(148, "MY", "Malaisie"),
(149, "MV", "Maldives"),
(150, "ML", "Mali"),
(151, "MT", "Malte"),
(152, "MH", "Îles Marshall"),
(153, "MQ", "Martinique"),
(154, "MR", "Mauritanie"),
(155, "MU", "Maurice"),
(156, "YT", "Mayotte"),
(157, "FM", "Micronésie"),
(158, "MD", "Moldavie"),
(159, "MC", "Monaco"),
(160, "MN", "Mongolie"),
(161, "ME", "Monténégro"),
(162, "MS", "Montserrat"),
(163, "MA", "Maroc"),
(164, "MZ", "Mozambique"),
(165, "MM", "Myanmar"),
(166, "NA", "Namibie"),
(167, "NR", "Nauru"),
(168, "NP", "Népal"),
(169, "AN", "Antilles néerlandaises"),
(170, "NC", "Nouvelle-Calédonie"),
(171, "NI", "Nicaragua"),
(172, "NE", "Niger"),
(173, "NG", "Nigeria"),
(174, "NU", "Nioué"),
(175, "NF", "Île Norfolk"),
(176, "KP", "Corée du Nord"),
(177, "MP", "Îles Mariannes du Nord"),
(178, "OM", "Oman"),
(179, "PK", "Pakistan"),
(180, "PW", "Palaos"),
(181, "PS", "Territoire palestinien"),
(182, "PA", "Panama"),
(183, "PG", "Papouasie-Nouvelle Guinée"),
(184, "PY", "Paraguay"),
(185, "PE", "Pérou"),
(186, "PH", "Philippines"),
(187, "PN", "Pitcairn"),
(188, "PR", "Porto Rico"),
(189, "QA", "Qatar"),
(190, "RE", "Réunion"),
(191, "CG", "Congo-Brazzaville"),
(192, "RO", "Roumanie"),
(193, "RU", "Russie"),
(194, "RW", "Rwanda"),
(195, "ST", "São Tomé-et-Príncipe"),
(196, "BL", "Saint-Barthélémy"),
(197, "SH", "Sainte-Hélène"),
(198, "KN", "Saint-Christophe-et-Niévès"),
(199, "LC", "Sainte-Lucie"),
(200, "MF", "Saint-Martin"), 
(201, "PM", "Saint-Pierre et Miquelon"),
(202, "VC", "Saint-Vincent-et-les Grenadines"),
(203, "WS", "Samoa"),
(204, "SM", "Saint-Marin"),
(205, "SA", "Arabie saoudite"),
(206, "SN", "Sénégal"),
(207, "RS", "Serbie"),
(208, "SC", "Seychelles"),
(209, "SL", "Sierra Leone"),
(210, "SG", "Singapour"),
(211, "SX", "Saint-Martin"),
(212, "SI", "Slovénie"),
(213, "SB", "Îles Salomon"),
(214, "SO", "Somalie"),
(215, "ZA", "Afrique du Sud"),
(216, "GS", "Géorgie du Sud et les îles Sandwich du Sud"),
(217, "SS", "Sud-Soudan"),
(218, "LK", "Sri Lanka"),
(219, "SD", "Soudan"),
(220, "SR", "Surinam"),
(221, "SJ", "Svalbard et Île Jan Mayen"),
(222, "SZ", "Swaziland"),
(223, "SY", "Syrie"),
(224, "TW", "Taïwan"),
(225, "TJ", "Tadjikistan"),
(226, "TZ", "Tanzanie"),
(227, "TH", "Thaïlande"),
(228, "TG", "République Togolaise"),
(229, "TK", "Tokelau"),
(230, "TO", "Tonga"),
(231, "TT", "Trinidad et Tobago"),
(232, "TN", "Tunisie"),
(233, "TM", "Turkménistan"),
(234, "TC", "Îles Turques-et-Caïques"),
(235, "TV", "Tuvalu"),
(236, "UM", "Îles mineures éloignées des États-Unis"),
(237, "VI", "Îles Vierges des États-Unis"),
(238, "UG", "Ouganda"),
(239, "UA", "Ukraine"),
(240, "AE", "Émirats Arabes Unis"),
(241, "UY", "Uruguay"),
(242, "UZ", "Ouzbékistan"),
(243, "VU", "Vanuatu"),
(244, "VA", "Vatican"),
(245, "VE", "Vénézuéla"),
(246, "VN", "Vietnam"),
(247, "WF", "Wallis-et-Futuna"),
(248, "EH", "Sahara Occidental"),
(249, "YE", "Yémen"),
(250, "ZM", "Zambie"),
(251, "ZW", "Zimbabwe")
');
    }
}
