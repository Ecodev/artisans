<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20220921155253 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE facilitator_document (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, file_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, category VARCHAR(191) NOT NULL, name VARCHAR(191) NOT NULL, INDEX IDX_8B774FEE61220EA6 (creator_id), INDEX IDX_8B774FEE7E3C61F9 (owner_id), INDEX IDX_8B774FEEE37ECFB0 (updater_id), UNIQUE INDEX UNIQ_8B774FEE93CB796C (file_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE facilitator_document ADD CONSTRAINT FK_8B774FEE61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE facilitator_document ADD CONSTRAINT FK_8B774FEE7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE facilitator_document ADD CONSTRAINT FK_8B774FEEE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE facilitator_document ADD CONSTRAINT FK_8B774FEE93CB796C FOREIGN KEY (file_id) REFERENCES file (id) ON DELETE SET NULL');
    }
}
