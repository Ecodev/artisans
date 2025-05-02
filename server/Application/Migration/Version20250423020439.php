<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20250423020439 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql(<<<'SQL'
                ALTER TABLE log CHANGE extra extra JSON DEFAULT '{}' NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE message CHANGE type type ENUM('register', 'reset_password', 'updated_user', 'confirmed_registration', 'user_pending_order', 'user_validated_order', 'admin_pending_order', 'admin_validated_order', 'request_membership_end', 'newsletter_subscription') NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE `order` CHANGE balance_chf balance_chf INT DEFAULT 0 NOT NULL, CHANGE balance_eur balance_eur INT DEFAULT 0 NOT NULL, CHANGE status status ENUM('pending', 'validated', 'canceled') DEFAULT 'pending' NOT NULL, CHANGE payment_method payment_method ENUM('datatrans', 'ebanking', 'bvr') NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE order_line CHANGE balance_chf balance_chf INT NOT NULL, CHANGE balance_eur balance_eur INT NOT NULL, CHANGE type type ENUM('other', 'paper', 'digital', 'both') NOT NULL, CHANGE additional_emails additional_emails JSON DEFAULT '[]' NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE product CHANGE price_per_unit_chf price_per_unit_chf INT DEFAULT 0 NOT NULL, CHANGE price_per_unit_eur price_per_unit_eur INT DEFAULT 0 NOT NULL, CHANGE type type ENUM('other', 'paper', 'digital', 'both') NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE session CHANGE dates dates JSON NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE subscription CHANGE price_per_unit_chf price_per_unit_chf INT DEFAULT 0 NOT NULL, CHANGE price_per_unit_eur price_per_unit_eur INT DEFAULT 0 NOT NULL, CHANGE type type ENUM('other', 'paper', 'digital', 'both') NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE user CHANGE role role ENUM('member', 'facilitator', 'administrator') DEFAULT 'member' NOT NULL, CHANGE subscription_type subscription_type ENUM('other', 'paper', 'digital', 'both') DEFAULT NULL, CHANGE membership membership ENUM('none', 'member') DEFAULT 'none' NOT NULL
            SQL);
    }
}
