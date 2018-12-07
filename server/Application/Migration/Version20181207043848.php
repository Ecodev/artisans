<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20181207043848 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE bookable_type (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, name VARCHAR(191) NOT NULL, INDEX IDX_B161DE161220EA6 (creator_id), INDEX IDX_B161DE17E3C61F9 (owner_id), INDEX IDX_B161DE1E37ECFB0 (updater_id), UNIQUE INDEX unique_name (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE bookable_type ADD CONSTRAINT FK_B161DE161220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE bookable_type ADD CONSTRAINT FK_B161DE17E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE bookable_type ADD CONSTRAINT FK_B161DE1E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE bookable ADD type_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE bookable ADD CONSTRAINT FK_A10B8124C54C8C93 FOREIGN KEY (type_id) REFERENCES bookable_type (id)');
        $this->addSql('CREATE INDEX IDX_A10B8124C54C8C93 ON bookable (type_id)');
        $this->addSql('ALTER TABLE user ADD door1 TINYINT(1) DEFAULT \'1\' NOT NULL, ADD door2 TINYINT(1) DEFAULT \'1\' NOT NULL, ADD door3 TINYINT(1) DEFAULT \'1\' NOT NULL, ADD door4 TINYINT(1) DEFAULT \'0\' NOT NULL');
    }
}
