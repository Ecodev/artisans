<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190125004010 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user CHANGE role role ENUM(\'booking_only\', \'individual\', \'member\', \'responsible\', \'administrator\') DEFAULT \'individual\' NOT NULL COMMENT \'(DC2Type:UserRole)\'');
    }
}
