<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20181206141536 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE booking_resource DROP FOREIGN KEY FK_87A56A9B89329D25');
        $this->addSql('ALTER TABLE tag_resource DROP FOREIGN KEY FK_8AA08FCD89329D25');
        $this->addSql('ALTER TABLE tag_resource DROP FOREIGN KEY FK_8AA08FCDBAD26311');
        $this->addSql('ALTER TABLE tag_user DROP FOREIGN KEY FK_639C69FFBAD26311');
        $this->addSql('CREATE TABLE user_tag (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, name VARCHAR(191) NOT NULL, color VARCHAR(7) DEFAULT \'\' NOT NULL, INDEX IDX_E89FD60861220EA6 (creator_id), INDEX IDX_E89FD6087E3C61F9 (owner_id), INDEX IDX_E89FD608E37ECFB0 (updater_id), UNIQUE INDEX unique_name (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_tag_user (user_tag_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_83118DFFDF80782C (user_tag_id), INDEX IDX_83118DFFA76ED395 (user_id), PRIMARY KEY(user_tag_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE bookable (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, initial_price NUMERIC(10, 0) DEFAULT \'0\' NOT NULL, periodic_price NUMERIC(10, 0) DEFAULT \'0\' NOT NULL, simultaneous_booking_maximum SMALLINT UNSIGNED DEFAULT 1 NOT NULL, booking_type ENUM(\'self_approved\', \'admin_approved\', \'admin_only\', \'mandatory\') DEFAULT \'self_approved\' NOT NULL COMMENT \'(DC2Type:BookingType)\', name VARCHAR(191) NOT NULL, description TEXT NOT NULL, code VARCHAR(10) DEFAULT \'\' NOT NULL, INDEX IDX_A10B812461220EA6 (creator_id), INDEX IDX_A10B81247E3C61F9 (owner_id), INDEX IDX_A10B8124E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE booking_bookable (booking_id INT NOT NULL, bookable_id INT NOT NULL, INDEX IDX_9A3F1FA93301C60 (booking_id), INDEX IDX_9A3F1FA9EC4F5B2F (bookable_id), PRIMARY KEY(booking_id, bookable_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE license (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, name VARCHAR(191) NOT NULL, INDEX IDX_5768F41961220EA6 (creator_id), INDEX IDX_5768F4197E3C61F9 (owner_id), INDEX IDX_5768F419E37ECFB0 (updater_id), UNIQUE INDEX unique_name (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE license_bookable (license_id INT NOT NULL, bookable_id INT NOT NULL, INDEX IDX_5D5B1013460F904B (license_id), INDEX IDX_5D5B1013EC4F5B2F (bookable_id), PRIMARY KEY(license_id, bookable_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE license_user (license_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_77C835A460F904B (license_id), INDEX IDX_77C835AA76ED395 (user_id), PRIMARY KEY(license_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_tag ADD CONSTRAINT FK_E89FD60861220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_tag ADD CONSTRAINT FK_E89FD6087E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_tag ADD CONSTRAINT FK_E89FD608E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_tag_user ADD CONSTRAINT FK_83118DFFDF80782C FOREIGN KEY (user_tag_id) REFERENCES user_tag (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_tag_user ADD CONSTRAINT FK_83118DFFA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE bookable ADD CONSTRAINT FK_A10B812461220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE bookable ADD CONSTRAINT FK_A10B81247E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE bookable ADD CONSTRAINT FK_A10B8124E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE booking_bookable ADD CONSTRAINT FK_9A3F1FA93301C60 FOREIGN KEY (booking_id) REFERENCES booking (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE booking_bookable ADD CONSTRAINT FK_9A3F1FA9EC4F5B2F FOREIGN KEY (bookable_id) REFERENCES bookable (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE license ADD CONSTRAINT FK_5768F41961220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE license ADD CONSTRAINT FK_5768F4197E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE license ADD CONSTRAINT FK_5768F419E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE license_bookable ADD CONSTRAINT FK_5D5B1013460F904B FOREIGN KEY (license_id) REFERENCES license (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE license_bookable ADD CONSTRAINT FK_5D5B1013EC4F5B2F FOREIGN KEY (bookable_id) REFERENCES bookable (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE license_user ADD CONSTRAINT FK_77C835A460F904B FOREIGN KEY (license_id) REFERENCES license (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE license_user ADD CONSTRAINT FK_77C835AA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('DROP TABLE booking_resource');
        $this->addSql('DROP TABLE resource');
        $this->addSql('DROP TABLE tag');
        $this->addSql('DROP TABLE tag_resource');
        $this->addSql('DROP TABLE tag_user');
        $this->addSql('ALTER TABLE booking ADD status ENUM(\'application\', \'booked\', \'processed\') DEFAULT \'application\' NOT NULL COMMENT \'(DC2Type:BookingStatus)\'');
    }
}
