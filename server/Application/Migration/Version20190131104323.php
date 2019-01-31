<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190131104323 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE message CHANGE type type ENUM(\'register\', \'reset_password\', \'monthly_reminder\', \'yearly_reminder\') NOT NULL COMMENT \'(DC2Type:MessageType)\'');
        $this->addSql('ALTER TABLE user CHANGE login login VARCHAR(50) DEFAULT NULL');
    }
}
