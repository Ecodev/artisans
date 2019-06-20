<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190620122000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user CHANGE role role enum(\'partner\',\'individual\',\'member\',\'product\',\'responsible\',\'administrator\') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT \'individual\' COMMENT \'(DC2Type:UserRole)\'');
    }
}
