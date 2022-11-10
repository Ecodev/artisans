<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20221110170227 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('SET FOREIGN_KEY_CHECKS=0');

        $this->addSql(
            <<<SQL
                CREATE TABLE `comment` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `event_id` INT(11) DEFAULT NULL,
                  `news_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `description` TEXT NOT NULL,
                  PRIMARY KEY (`id`),
                  KEY `IDX_9474526C61220EA6` (`creator_id`),
                  KEY `IDX_9474526C7E3C61F9` (`owner_id`),
                  KEY `IDX_9474526CE37ECFB0` (`updater_id`),
                  KEY `IDX_9474526C71F7E88B` (`event_id`),
                  KEY `IDX_9474526CB5A459A0` (`news_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_9474526C61220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_9474526C71F7E88B` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_9474526C7E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_9474526CB5A459A0` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_9474526CE37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `configuration` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `key` VARCHAR(191) NOT NULL,
                  `value` LONGTEXT NOT NULL,
                  `description` TEXT NOT NULL,
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `UNIQ_A5E2A5D74E645A7E` (`key`),
                  KEY `IDX_A5E2A5D761220EA6` (`creator_id`),
                  KEY `IDX_A5E2A5D77E3C61F9` (`owner_id`),
                  KEY `IDX_A5E2A5D7E37ECFB0` (`updater_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_A5E2A5D761220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_A5E2A5D77E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_A5E2A5D7E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `country` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `code` VARCHAR(2) NOT NULL,
                  `name` VARCHAR(191) NOT NULL,
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `UNIQ_5373C96677153098` (`code`),
                  KEY `IDX_5373C96661220EA6` (`creator_id`),
                  KEY `IDX_5373C9667E3C61F9` (`owner_id`),
                  KEY `IDX_5373C966E37ECFB0` (`updater_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_5373C96661220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_5373C9667E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_5373C966E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `event` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `name` VARCHAR(191) NOT NULL,
                  `date` DATETIME NOT NULL,
                  `place` VARCHAR(191) NOT NULL,
                  `type` VARCHAR(191) NOT NULL,
                  PRIMARY KEY (`id`),
                  KEY `IDX_3BAE0AA761220EA6` (`creator_id`),
                  KEY `IDX_3BAE0AA77E3C61F9` (`owner_id`),
                  KEY `IDX_3BAE0AA7E37ECFB0` (`updater_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_3BAE0AA761220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_3BAE0AA77E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_3BAE0AA7E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `facilitator_document` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `file_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `category` VARCHAR(191) NOT NULL,
                  `name` VARCHAR(191) NOT NULL,
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `UNIQ_8B774FEE93CB796C` (`file_id`),
                  KEY `IDX_8B774FEE61220EA6` (`creator_id`),
                  KEY `IDX_8B774FEE7E3C61F9` (`owner_id`),
                  KEY `IDX_8B774FEEE37ECFB0` (`updater_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_8B774FEE61220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_8B774FEE7E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_8B774FEE93CB796C` FOREIGN KEY (`file_id`) REFERENCES `file` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_8B774FEEE37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `file` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `filename` VARCHAR(190) NOT NULL DEFAULT '',
                  `mime` VARCHAR(255) NOT NULL DEFAULT '',
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `unique_name` (`filename`),
                  KEY `IDX_8C9F361061220EA6` (`creator_id`),
                  KEY `IDX_8C9F36107E3C61F9` (`owner_id`),
                  KEY `IDX_8C9F3610E37ECFB0` (`updater_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_8C9F361061220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_8C9F36107E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_8C9F3610E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `image` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `filename` VARCHAR(190) NOT NULL DEFAULT '',
                  `mime` VARCHAR(255) NOT NULL DEFAULT '',
                  `width` INT(11) NOT NULL,
                  `height` INT(11) NOT NULL,
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `unique_name` (`filename`),
                  KEY `IDX_C53D045F61220EA6` (`creator_id`),
                  KEY `IDX_C53D045F7E3C61F9` (`owner_id`),
                  KEY `IDX_C53D045FE37ECFB0` (`updater_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_C53D045F61220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_C53D045F7E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_C53D045FE37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `log` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `priority` SMALLINT(6) NOT NULL,
                  `message` VARCHAR(5000) NOT NULL,
                  `referer` VARCHAR(500) NOT NULL,
                  `request` VARCHAR(1000) NOT NULL,
                  `ip` VARCHAR(40) NOT NULL,
                  `extra` LONGTEXT NOT NULL DEFAULT '[]' COMMENT '(DC2Type:json)',
                  `url` VARCHAR(2000) NOT NULL DEFAULT '',
                  PRIMARY KEY (`id`),
                  KEY `IDX_8F3F68C561220EA6` (`creator_id`),
                  KEY `IDX_8F3F68C57E3C61F9` (`owner_id`),
                  KEY `IDX_8F3F68C5E37ECFB0` (`updater_id`),
                  KEY `message` (`message`(191)),
                  KEY `update_date` (`update_date`),
                  KEY `priority` (`priority`),
                  KEY `creation_date` (`creation_date`),
                  CONSTRAINT `FK_8F3F68C561220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_8F3F68C57E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_8F3F68C5E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `message` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `recipient_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `email` VARCHAR(191) NOT NULL,
                  `type` ENUM('register','reset_password','updated_user','confirmed_registration','user_pending_order','user_validated_order','admin_pending_order','admin_validated_order','request_membership_end','newsletter_subscription') NOT NULL COMMENT '(DC2Type:MessageType)',
                  `date_sent` DATETIME DEFAULT NULL,
                  `subject` VARCHAR(255) NOT NULL DEFAULT '',
                  `body` TEXT NOT NULL,
                  PRIMARY KEY (`id`),
                  KEY `IDX_B6BD307F61220EA6` (`creator_id`),
                  KEY `IDX_B6BD307F7E3C61F9` (`owner_id`),
                  KEY `IDX_B6BD307FE37ECFB0` (`updater_id`),
                  KEY `IDX_B6BD307FE92F8F78` (`recipient_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_B6BD307F61220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_B6BD307F7E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_B6BD307FE37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_B6BD307FE92F8F78` FOREIGN KEY (`recipient_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `news` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `name` VARCHAR(191) NOT NULL,
                  `description` TEXT NOT NULL,
                  `date` DATETIME NOT NULL,
                  `is_active` TINYINT(1) NOT NULL DEFAULT 0,
                  `content` TEXT NOT NULL,
                  PRIMARY KEY (`id`),
                  KEY `IDX_1DD3995061220EA6` (`creator_id`),
                  KEY `IDX_1DD399507E3C61F9` (`owner_id`),
                  KEY `IDX_1DD39950E37ECFB0` (`updater_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_1DD3995061220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_1DD399507E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_1DD39950E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `order` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `balance_chf` INT(11) NOT NULL DEFAULT 0 COMMENT '(DC2Type:CHF)',
                  `balance_eur` INT(11) NOT NULL DEFAULT 0 COMMENT '(DC2Type:EUR)',
                  `status` ENUM('pending','validated','canceled') NOT NULL DEFAULT 'pending' COMMENT '(DC2Type:OrderStatus)',
                  `payment_method` ENUM('datatrans','ebanking','bvr') NOT NULL COMMENT '(DC2Type:PaymentMethod)',
                  `internal_remarks` TEXT NOT NULL,
                  `country_id` INT(11) DEFAULT NULL,
                  `first_name` VARCHAR(191) NOT NULL DEFAULT '',
                  `last_name` VARCHAR(191) NOT NULL DEFAULT '',
                  `street` VARCHAR(255) NOT NULL DEFAULT '',
                  `postcode` VARCHAR(20) NOT NULL DEFAULT '',
                  `locality` VARCHAR(255) NOT NULL DEFAULT '',
                  PRIMARY KEY (`id`),
                  KEY `IDX_F529939861220EA6` (`creator_id`),
                  KEY `IDX_F52993987E3C61F9` (`owner_id`),
                  KEY `IDX_F5299398E37ECFB0` (`updater_id`),
                  KEY `IDX_F5299398F92F3E70` (`country_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_F529939861220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_F52993987E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_F5299398E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_F5299398F92F3E70` FOREIGN KEY (`country_id`) REFERENCES `country` (`id`) ON DELETE SET NULL
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `order_line` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `order_id` INT(11) NOT NULL,
                  `product_id` INT(11) DEFAULT NULL,
                  `subscription_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `name` VARCHAR(191) NOT NULL,
                  `quantity` SMALLINT(5) UNSIGNED NOT NULL DEFAULT 0,
                  `is_chf` TINYINT(1) NOT NULL DEFAULT 1,
                  `balance_chf` INT(11) NOT NULL COMMENT '(DC2Type:CHF)',
                  `balance_eur` INT(11) NOT NULL COMMENT '(DC2Type:EUR)',
                  `type` ENUM('other','paper','digital','both') NOT NULL COMMENT '(DC2Type:ProductType)',
                  `additional_emails` LONGTEXT NOT NULL DEFAULT '[]' COMMENT '(DC2Type:json)',
                  PRIMARY KEY (`id`),
                  KEY `IDX_9CE58EE161220EA6` (`creator_id`),
                  KEY `IDX_9CE58EE17E3C61F9` (`owner_id`),
                  KEY `IDX_9CE58EE1E37ECFB0` (`updater_id`),
                  KEY `IDX_9CE58EE18D9F6D38` (`order_id`),
                  KEY `IDX_9CE58EE14584665A` (`product_id`),
                  KEY `IDX_9CE58EE19A1887DC` (`subscription_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_9CE58EE14584665A` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_9CE58EE161220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_9CE58EE17E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_9CE58EE18D9F6D38` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_9CE58EE19A1887DC` FOREIGN KEY (`subscription_id`) REFERENCES `subscription` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_9CE58EE1E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `not_product_and_subscription` CHECK (`product_id` IS NULL OR `subscription_id` IS NULL)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `organization` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `subscription_last_review_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `pattern` LONGTEXT NOT NULL,
                  `should_delete` TINYINT(1) NOT NULL DEFAULT 0,
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `unique_pattern` (`pattern`(768)),
                  KEY `IDX_C1EE637C61220EA6` (`creator_id`),
                  KEY `IDX_C1EE637C7E3C61F9` (`owner_id`),
                  KEY `IDX_C1EE637CE37ECFB0` (`updater_id`),
                  KEY `IDX_C1EE637C3E06759` (`subscription_last_review_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_C1EE637C3E06759` FOREIGN KEY (`subscription_last_review_id`) REFERENCES `product` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_C1EE637C61220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_C1EE637C7E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_C1EE637CE37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `product` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `image_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `price_per_unit_chf` INT(11) NOT NULL DEFAULT 0 COMMENT '(DC2Type:CHF)',
                  `price_per_unit_eur` INT(11) NOT NULL DEFAULT 0 COMMENT '(DC2Type:EUR)',
                  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
                  `name` VARCHAR(191) NOT NULL,
                  `content` TEXT NOT NULL,
                  `code` VARCHAR(25) DEFAULT NULL,
                  `internal_remarks` TEXT NOT NULL,
                  `reading_duration` SMALLINT(5) UNSIGNED DEFAULT NULL,
                  `release_date` DATE DEFAULT NULL,
                  `review_number` SMALLINT(5) UNSIGNED DEFAULT NULL,
                  `type` ENUM('other','paper','digital','both') NOT NULL COMMENT '(DC2Type:ProductType)',
                  `illustration_id` INT(11) DEFAULT NULL,
                  `file_id` INT(11) DEFAULT NULL,
                  `description` TEXT NOT NULL,
                  `review_id` INT(11) DEFAULT NULL,
                  `is_highlighted` TINYINT(1) NOT NULL DEFAULT 0,
                  `sorting` SMALLINT(6) NOT NULL DEFAULT 0,
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `UNIQ_D34A04AD77153098` (`code`),
                  UNIQUE KEY `UNIQ_D34A04AD3DA5256D` (`image_id`),
                  UNIQUE KEY `UNIQ_D34A04AD5926566C` (`illustration_id`),
                  UNIQUE KEY `UNIQ_D34A04AD93CB796C` (`file_id`),
                  UNIQUE KEY `UNIQ_D34A04AD1CE65894` (`review_number`),
                  KEY `IDX_D34A04AD61220EA6` (`creator_id`),
                  KEY `IDX_D34A04AD7E3C61F9` (`owner_id`),
                  KEY `IDX_D34A04ADE37ECFB0` (`updater_id`),
                  KEY `IDX_D34A04AD3E2E969B` (`review_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_D34A04AD3DA5256D` FOREIGN KEY (`image_id`) REFERENCES `image` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_D34A04AD3E2E969B` FOREIGN KEY (`review_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_D34A04AD5926566C` FOREIGN KEY (`illustration_id`) REFERENCES `image` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_D34A04AD61220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_D34A04AD7E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_D34A04AD93CB796C` FOREIGN KEY (`file_id`) REFERENCES `file` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_D34A04ADE37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `CONSTRAINT_1` CHECK (`review_id` IS NULL OR `review_number` IS NULL)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `product_product` (
                  `product_source` INT(11) NOT NULL,
                  `product_target` INT(11) NOT NULL,
                  PRIMARY KEY (`product_source`,`product_target`),
                  KEY `IDX_2931F1D3DF63ED7` (`product_source`),
                  KEY `IDX_2931F1D24136E58` (`product_target`),
                  CONSTRAINT `FK_2931F1D24136E58` FOREIGN KEY (`product_target`) REFERENCES `product` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_2931F1D3DF63ED7` FOREIGN KEY (`product_source`) REFERENCES `product` (`id`) ON DELETE CASCADE
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `product_tag` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `name` VARCHAR(191) NOT NULL,
                  `color` VARCHAR(7) NOT NULL DEFAULT '',
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `unique_name` (`name`),
                  KEY `IDX_E3A6E39C61220EA6` (`creator_id`),
                  KEY `IDX_E3A6E39C7E3C61F9` (`owner_id`),
                  KEY `IDX_E3A6E39CE37ECFB0` (`updater_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_E3A6E39C61220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_E3A6E39C7E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_E3A6E39CE37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `product_tag_product` (
                  `product_tag_id` INT(11) NOT NULL,
                  `product_id` INT(11) NOT NULL,
                  PRIMARY KEY (`product_tag_id`,`product_id`),
                  KEY `IDX_4D54B718D8AE22B5` (`product_tag_id`),
                  KEY `IDX_4D54B7184584665A` (`product_id`),
                  CONSTRAINT `FK_4D54B7184584665A` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_4D54B718D8AE22B5` FOREIGN KEY (`product_tag_id`) REFERENCES `product_tag` (`id`) ON DELETE CASCADE
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `session` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `region` VARCHAR(255) NOT NULL DEFAULT '',
                  `price` VARCHAR(255) NOT NULL DEFAULT '',
                  `availability` VARCHAR(255) NOT NULL DEFAULT '',
                  `dates` LONGTEXT NOT NULL COMMENT '(DC2Type:json)',
                  `name` VARCHAR(191) NOT NULL,
                  `description` TEXT NOT NULL,
                  `locality` VARCHAR(255) NOT NULL DEFAULT '',
                  `street` VARCHAR(255) NOT NULL DEFAULT '',
                  `start_date` DATE NOT NULL,
                  `end_date` DATE NOT NULL,
                  `mailing_list` VARCHAR(255) NOT NULL DEFAULT '',
                  `internal_remarks` TEXT NOT NULL,
                  PRIMARY KEY (`id`),
                  KEY `IDX_D044D5D461220EA6` (`creator_id`),
                  KEY `IDX_D044D5D47E3C61F9` (`owner_id`),
                  KEY `IDX_D044D5D4E37ECFB0` (`updater_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_D044D5D461220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_D044D5D47E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_D044D5D4E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `session_user` (
                  `session_id` INT(11) NOT NULL,
                  `user_id` INT(11) NOT NULL,
                  PRIMARY KEY (`session_id`,`user_id`),
                  KEY `IDX_4BE2D663613FECDF` (`session_id`),
                  KEY `IDX_4BE2D663A76ED395` (`user_id`),
                  CONSTRAINT `FK_4BE2D663613FECDF` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_4BE2D663A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `subscription` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `image_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `price_per_unit_chf` INT(11) NOT NULL DEFAULT 0 COMMENT '(DC2Type:CHF)',
                  `price_per_unit_eur` INT(11) NOT NULL DEFAULT 0 COMMENT '(DC2Type:EUR)',
                  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
                  `name` VARCHAR(191) NOT NULL,
                  `description` TEXT NOT NULL,
                  `code` VARCHAR(25) DEFAULT NULL,
                  `internal_remarks` TEXT NOT NULL,
                  `type` ENUM('paper','digital','both') NOT NULL COMMENT '(DC2Type:ProductType)',
                  `illustration_id` INT(11) DEFAULT NULL,
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `UNIQ_A3C664D377153098` (`code`),
                  UNIQUE KEY `UNIQ_A3C664D33DA5256D` (`image_id`),
                  UNIQUE KEY `UNIQ_A3C664D35926566C` (`illustration_id`),
                  KEY `IDX_A3C664D361220EA6` (`creator_id`),
                  KEY `IDX_A3C664D37E3C61F9` (`owner_id`),
                  KEY `IDX_A3C664D3E37ECFB0` (`updater_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_A3C664D33DA5256D` FOREIGN KEY (`image_id`) REFERENCES `image` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_A3C664D35926566C` FOREIGN KEY (`illustration_id`) REFERENCES `image` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_A3C664D361220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_A3C664D37E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_A3C664D3E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `user` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `first_name` VARCHAR(191) NOT NULL DEFAULT '',
                  `last_name` VARCHAR(191) NOT NULL DEFAULT '',
                  `password` VARCHAR(255) NOT NULL,
                  `email` VARCHAR(191) NOT NULL,
                  `role` ENUM('member','facilitator','administrator') NOT NULL DEFAULT 'member' COMMENT '(DC2Type:UserRole)',
                  `phone` VARCHAR(25) NOT NULL DEFAULT '',
                  `web_temporary_access` TINYINT(1) NOT NULL DEFAULT 0,
                  `token` VARCHAR(32) DEFAULT NULL,
                  `token_creation_date` DATETIME DEFAULT NULL,
                  `street` VARCHAR(255) NOT NULL DEFAULT '',
                  `postcode` VARCHAR(20) NOT NULL DEFAULT '',
                  `locality` VARCHAR(255) NOT NULL DEFAULT '',
                  `subscription_last_review_id` INT(11) DEFAULT NULL,
                  `subscription_type` ENUM('other','paper','digital','both') DEFAULT NULL COMMENT '(DC2Type:ProductType)',
                  `country_id` INT(11) DEFAULT NULL,
                  `membership` ENUM('none','member') NOT NULL DEFAULT 'none' COMMENT '(DC2Type:Membership)',
                  `should_delete` TINYINT(1) NOT NULL DEFAULT 0,
                  `is_public_facilitator` TINYINT(1) NOT NULL DEFAULT 0,
                  `first_login` DATETIME DEFAULT NULL,
                  `last_login` DATETIME DEFAULT NULL,
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `UNIQ_8D93D649E7927C74` (`email`),
                  UNIQUE KEY `UNIQ_8D93D6495F37A13B` (`token`),
                  KEY `IDX_8D93D64961220EA6` (`creator_id`),
                  KEY `IDX_8D93D6497E3C61F9` (`owner_id`),
                  KEY `IDX_8D93D649E37ECFB0` (`updater_id`),
                  KEY `IDX_8D93D649F92F3E70` (`country_id`),
                  KEY `IDX_8D93D6493E06759` (`subscription_last_review_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_8D93D6493E06759` FOREIGN KEY (`subscription_last_review_id`) REFERENCES `product` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_8D93D64961220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_8D93D6497E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_8D93D649E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_8D93D649F92F3E70` FOREIGN KEY (`country_id`) REFERENCES `country` (`id`) ON DELETE SET NULL
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql('SET FOREIGN_KEY_CHECKS=1');

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
(29, "GB", "Royaume-Uni"),
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
(99, "GF", "Guyane Française"),
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
(170, "NC", "Nouvelle Calédonie"),
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
