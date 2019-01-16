<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190115160500 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user ADD status ENUM(\'inactive\', \'active\', \'new\', \'archived\') DEFAULT \'new\' NOT NULL COMMENT \'(DC2Type:UserStatus)\'');
        $this->addSql('ALTER TABLE user CHANGE role role ENUM(\'booking_only\', \'member\', \'responsible\', \'administrator\') DEFAULT \'member\' NOT NULL COMMENT \'(DC2Type:UserRole)\'');
    }
}
