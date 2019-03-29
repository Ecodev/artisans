<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190329154244 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user ADD swiss_sailing_type ENUM(\'active\', \'passive\', \'junior\') DEFAULT NULL COMMENT \'(DC2Type:SwissSailingType)\', ADD swiss_windsurf_type ENUM(\'active\', \'passive\') DEFAULT NULL COMMENT \'(DC2Type:SwissWindsurfType)\', CHANGE ichtus_swiss_sailing swiss_sailing VARCHAR(25) DEFAULT \'\' NOT NULL');
    }
}
