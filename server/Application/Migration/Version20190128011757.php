<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190128011757 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE bookable ADD is_active TINYINT(1) DEFAULT \'1\' NOT NULL, ADD state ENUM(\'good\', \'used\', \'degraded\') DEFAULT \'good\' NOT NULL COMMENT \'(DC2Type:BookableState)\', ADD verification_date DATE DEFAULT NULL');
    }
}
