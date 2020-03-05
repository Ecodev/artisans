<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20200305162727 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE comment (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, event_id INT DEFAULT NULL, news_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, description TEXT NOT NULL, INDEX IDX_9474526C61220EA6 (creator_id), INDEX IDX_9474526C7E3C61F9 (owner_id), INDEX IDX_9474526CE37ECFB0 (updater_id), INDEX IDX_9474526C71F7E88B (event_id), INDEX IDX_9474526CB5A459A0 (news_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526C61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526C7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526C71F7E88B FOREIGN KEY (event_id) REFERENCES event (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CB5A459A0 FOREIGN KEY (news_id) REFERENCES news (id) ON DELETE CASCADE');
    }
}
