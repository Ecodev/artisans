<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190125001731 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user CHANGE role role ENUM(\'booking_only\', \'individual\', \'member\', \'responsible\', \'administrator\') DEFAULT \'individual\' NOT NULL COMMENT \'(DC2Type:UserRole)\'');

        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649602AD315');
        $this->addSql('DROP INDEX IDX_8D93D649602AD315 ON user');
        $this->addSql('UPDATE user SET owner_id = responsible_id');
        $this->addSql('ALTER TABLE user DROP responsible_id');

        $this->addSql('ALTER TABLE booking DROP FOREIGN KEY FK_E00CEDDE602AD315');
        $this->addSql('DROP INDEX IDX_E00CEDDE602AD315 ON booking');
        $this->addSql('UPDATE booking SET owner_id = responsible_id');
        $this->addSql('ALTER TABLE booking DROP responsible_id');
    }
}
