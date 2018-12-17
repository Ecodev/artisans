<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20181217162117 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE bookable DROP FOREIGN KEY FK_A10B8124C54C8C93');
        $this->addSql('CREATE TABLE bookable_tag (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, name VARCHAR(191) NOT NULL, INDEX IDX_C360AD1261220EA6 (creator_id), INDEX IDX_C360AD127E3C61F9 (owner_id), INDEX IDX_C360AD12E37ECFB0 (updater_id), UNIQUE INDEX unique_name (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE bookable_tag_bookable (bookable_tag_id INT NOT NULL, bookable_id INT NOT NULL, INDEX IDX_207F7C112FF81111 (bookable_tag_id), INDEX IDX_207F7C11EC4F5B2F (bookable_id), PRIMARY KEY(bookable_tag_id, bookable_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE bookable_tag ADD CONSTRAINT FK_C360AD1261220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE bookable_tag ADD CONSTRAINT FK_C360AD127E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE bookable_tag ADD CONSTRAINT FK_C360AD12E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE bookable_tag_bookable ADD CONSTRAINT FK_207F7C112FF81111 FOREIGN KEY (bookable_tag_id) REFERENCES bookable_tag (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE bookable_tag_bookable ADD CONSTRAINT FK_207F7C11EC4F5B2F FOREIGN KEY (bookable_id) REFERENCES bookable (id) ON DELETE CASCADE');
        $this->addSql('DROP TABLE bookable_type');
        $this->addSql('DROP INDEX IDX_A10B8124C54C8C93 ON bookable');
        $this->addSql('ALTER TABLE bookable DROP type_id');
    }
}
